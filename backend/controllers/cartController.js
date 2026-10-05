const { CartItem, Product } = require("../models");

const getCart = async (req, res) => {
  const items = await CartItem.findAll({
    where: { userId: req.user.id },
    include: [{ model: Product, as: "product" }],
  });
  res.json(items);
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let item = await CartItem.findOne({ where: { userId: req.user.id, productId } });
    if (item) {
      item.quantity += quantity || 1;
      await item.save();
    } else {
      item = await CartItem.create({ userId: req.user.id, productId, quantity: quantity || 1 });
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCartItem = async (req, res) => {
  const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  item.quantity = req.body.quantity;
  await item.save();
  res.json(item);
};

const removeCartItem = async (req, res) => {
  const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  await item.destroy();
  res.json({ message: "Removed from cart" });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
