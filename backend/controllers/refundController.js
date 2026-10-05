const { Refund, Order, OrderItem, Product, User } = require("../models");

// POST /api/refunds -> buyer requests a refund for an order item
const requestRefund = async (req, res) => {
  try {
    const { orderId, orderItemId, reason } = req.body;
    const order = await Order.findOne({ where: { id: orderId, buyerId: req.user.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const refund = await Refund.create({
      orderId,
      orderItemId,
      reason,
      buyerId: req.user.id,
    });
    res.status(201).json(refund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/refunds/my -> buyer's own refund requests
const getMyRefunds = async (req, res) => {
  const refunds = await Refund.findAll({
    where: { buyerId: req.user.id },
    include: [{ model: OrderItem, as: "orderItem", include: [{ model: Product, as: "product" }] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(refunds);
};

// GET /api/refunds/seller -> refund requests for orders containing this seller's products
const getSellerRefunds = async (req, res) => {
  const refunds = await Refund.findAll({
    include: [
      { model: OrderItem, as: "orderItem", include: [{ model: Product, as: "product", where: { sellerId: req.user.id } }] },
      { model: User, as: "buyer", attributes: ["id", "fullName", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(refunds);
};

// GET /api/refunds/all -> admin: every refund request
const getAllRefunds = async (req, res) => {
  const refunds = await Refund.findAll({
    include: [
      { model: OrderItem, as: "orderItem", include: [{ model: Product, as: "product" }] },
      { model: User, as: "buyer", attributes: ["id", "fullName", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(refunds);
};

// PUT /api/refunds/:id/status -> seller (who owns the product) or admin
const updateRefundStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" | "rejected"
    const refund = await Refund.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: "orderItem", include: [{ model: Product, as: "product" }] }],
    });
    if (!refund) return res.status(404).json({ message: "Refund request not found" });

    const isOwner = refund.orderItem?.product?.sellerId === req.user.id;
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not allowed" });
    }
    refund.status = status;
    await refund.save();
    res.json(refund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { requestRefund, getMyRefunds, getSellerRefunds, getAllRefunds, updateRefundStatus };
