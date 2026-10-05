const Stripe = require("stripe");
const { PaymentMethod } = require("../models");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Ensures the logged-in user has a Stripe Customer, creating one if needed.
const ensureStripeCustomer = async (user) => {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.fullName,
  });
  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id;
};

// POST /api/payment-methods/setup-intent
// Starts the "add a card" flow: the frontend uses the returned client_secret
// with Stripe Elements to securely collect card details.
const createSetupIntent = async (req, res) => {
  try {
    const customerId = await ensureStripeCustomer(req.user);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/payment-methods -> { paymentMethodId } after stripe.confirmCardSetup on the frontend
const savePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

    const existingCount = await PaymentMethod.count({ where: { userId: req.user.id } });

    const saved = await PaymentMethod.create({
      userId: req.user.id,
      stripePaymentMethodId: pm.id,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: existingCount === 0, // first saved card becomes the default
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/payment-methods
const getMyPaymentMethods = async (req, res) => {
  const methods = await PaymentMethod.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  res.json(methods);
};

// DELETE /api/payment-methods/:id
const deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!method) return res.status(404).json({ message: "Payment method not found" });

    try {
      await stripe.paymentMethods.detach(method.stripePaymentMethodId);
    } catch {
      // already detached on Stripe's side — fine, still remove our local record
    }
    await method.destroy();
    res.json({ message: "Payment method removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSetupIntent, savePaymentMethod, getMyPaymentMethods, deletePaymentMethod };
