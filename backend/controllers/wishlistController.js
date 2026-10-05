const { WishlistItem, Product } = require("../models");

const getWishlist = async (req, res) => {
  const items = await WishlistItem.findAll({
    where: { userId: req.user.id },
    include: [{ model: Product, as: "product" }],
  });
  res.json(items);
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await WishlistItem.findOne({ where: { userId: req.user.id, productId } });
    if (existing) {
      await existing.destroy();
      return res.json({ wishlisted: false });
    }
    await WishlistItem.create({ userId: req.user.id, productId });
    res.status(201).json({ wishlisted: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWishlist, toggleWishlist };
