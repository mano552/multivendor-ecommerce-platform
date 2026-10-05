const Stripe = require("stripe");
const { Op } = require("sequelize");
const { Order, OrderItem, CartItem, Product, User, TrackingUpdate } = require("../models");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper: build order + order items from the buyer's cart, then clear cart
const createOrderFromCart = async (userId, shipping, paymentMethod) => {
  const cartItems = await CartItem.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
  });
  if (!cartItems.length) throw new Error("Cart is empty");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product.discountPrice || item.product.price),
    0
  );

  const order = await Order.create({
    buyerId: userId,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    shippingFullName: shipping.fullName,
    shippingPhone: shipping.phone,
    shippingAddress1: shipping.address1,
    shippingAddress2: shipping.address2,
    shippingZip: shipping.zip,
    shippingCity: shipping.city,
  });

  for (const item of cartItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price,
    });
    item.product.sold += item.quantity;
    item.product.stock = Math.max(0, item.product.stock - item.quantity);
    await item.product.save();
  }

  await CartItem.destroy({ where: { userId } });

  await TrackingUpdate.create({
    orderId: order.id,
    status: "processing",
    note: "Order placed",
  });

  return { order, cartItems };
};

// POST /api/orders/cod  -> Cash on delivery, order placed immediately
const placeCodOrder = async (req, res) => {
  try {
    const { shipping } = req.body;
    const { order } = await createOrderFromCart(req.user.id, shipping, "cod");
    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/orders/create-checkout-session -> Stripe card payment
const createCheckoutSession = async (req, res) => {
  try {
    const { shipping } = req.body;
    const { order, cartItems } = await createOrderFromCart(req.user.id, shipping, "card");

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name },
        unit_amount: Math.round((item.product.discountPrice || item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: order.id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url, orderId: order.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Stripe webhook: POST /api/orders/webhook (raw body)
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const order = await Order.findByPk(orderId);
    if (order) {
      order.paymentStatus = "paid";
      await order.save();
    }
  }
  res.json({ received: true });
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { buyerId: req.user.id },
    include: [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

// GET /api/orders/seller -> orders containing at least one of this seller's products
const getSellerOrders = async (req, res) => {
  const items = await OrderItem.findAll({
    include: [
      { model: Product, as: "product", where: { sellerId: req.user.id }, attributes: ["id", "name", "sellerId"] },
      { model: Order, attributes: ["id", "orderStatus", "paymentStatus", "paymentMethod", "createdAt", "shippingFullName", "shippingAddress1", "shippingCity"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(items);
};

// PUT /api/orders/:id/status -> seller (only if they have items in it) or admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const ownsItem = order.items.some((it) => it.product.sellerId === req.user.id);
    if (req.user.role !== "admin" && !ownsItem) {
      return res.status(403).json({ message: "Not allowed" });
    }
    order.orderStatus = orderStatus;
    await order.save();
    await TrackingUpdate.create({ orderId: order.id, status: orderStatus, note: note || null });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id/tracking -> buyer who owns it, a seller with items in it, or admin
const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] },
        { model: TrackingUpdate, as: "trackingHistory" },
      ],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isBuyer = order.buyerId === req.user.id;
    const isSeller = order.items.some((it) => it.product.sellerId === req.user.id);
    if (!isBuyer && !isSeller && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const history = [...order.trackingHistory].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json({ order, history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/all -> admin: every order on the platform
const getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] },
      { model: User, as: "buyer", attributes: ["id", "fullName", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

// GET /api/orders/seller/earnings -> total + monthly breakdown for the logged-in seller
const getSellerEarnings = async (req, res) => {
  const items = await OrderItem.findAll({
    include: [
      { model: Product, as: "product", where: { sellerId: req.user.id }, attributes: ["id", "name"] },
      { model: Order, attributes: ["id", "paymentStatus", "createdAt"] },
    ],
  });

  const paidItems = items.filter((it) => it.Order.paymentStatus === "paid" || it.Order.paymentStatus === "pending");
  const totalEarnings = paidItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalOrders = new Set(items.map((it) => it.Order.id)).size;

  const monthly = {};
  paidItems.forEach((it) => {
    const key = new Date(it.Order.createdAt).toISOString().slice(0, 7); // YYYY-MM
    monthly[key] = (monthly[key] || 0) + it.price * it.quantity;
  });

  const byProduct = {};
  paidItems.forEach((it) => {
    const key = it.product.name;
    byProduct[key] = (byProduct[key] || 0) + it.price * it.quantity;
  });

  res.json({
    totalEarnings,
    totalOrders,
    monthly: Object.entries(monthly).sort().map(([month, amount]) => ({ month, amount })),
    byProduct: Object.entries(byProduct).map(([product, amount]) => ({ product, amount })),
  });
};

module.exports = {
  placeCodOrder,
  createCheckoutSession,
  stripeWebhook,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderTracking,
  getSellerEarnings,
};
