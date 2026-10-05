const { User, Product, Order, Category } = require("../models");

// GET /api/admin/sellers
const getSellers = async (req, res) => {
  const sellers = await User.findAll({
    where: { role: "seller" },
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
  res.json(sellers);
};

// PUT /api/admin/sellers/:id/approve
const toggleSellerApproval = async (req, res) => {
  const seller = await User.findOne({ where: { id: req.params.id, role: "seller" } });
  if (!seller) return res.status(404).json({ message: "Seller not found" });
  seller.approved = !seller.approved;
  await seller.save();
  res.json(seller);
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  const [totalUsers, totalSellers, totalProducts, totalOrders, orders] = await Promise.all([
    User.count(),
    User.count({ where: { role: "seller" } }),
    Product.count(),
    Order.count(),
    Order.findAll({ attributes: ["totalAmount", "paymentStatus"] }),
  ]);
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({ totalUsers, totalSellers, totalProducts, totalOrders, totalRevenue });
};

// GET /api/admin/products -> every product on the platform (with seller info)
const getAllProducts = async (req, res) => {
  const products = await Product.findAll({
    include: [
      { model: User, as: "seller", attributes: ["id", "fullName", "shopName"] },
      { model: Category, as: "category", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(products);
};

module.exports = { getSellers, toggleSellerApproval, getStats, getAllProducts };
