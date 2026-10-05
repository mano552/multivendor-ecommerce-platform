const { Op } = require("sequelize");
const { Product, Category, User, Review } = require("../models");

// GET /api/products?category=slug&search=&featured=true&bestSeller=true
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, bestSeller, sellerId } = req.query;
    const where = {};
    const include = [
      { model: Category, as: "category", attributes: ["id", "name", "slug"] },
      { model: User, as: "seller", attributes: ["id", "fullName", "shopName"] },
    ];

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (featured === "true") where.isFeatured = true;
    if (bestSeller === "true") where.isBestSeller = true;
    if (sellerId) where.sellerId = sellerId;

    if (category) {
      const cat = await Category.findOne({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
      else return res.json([]);
    }

    const products = await Product.findAll({ where, include, order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category" },
        { model: User, as: "seller", attributes: ["id", "fullName", "shopName", "avatar"] },
        { model: Review, as: "reviews", include: [{ model: User, as: "user", attributes: ["id", "fullName", "avatar"] }] },
      ],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.findAll({
      where: { categoryId: product.categoryId, id: { [Op.ne]: product.id } },
      limit: 4,
    });

    res.json({ product, related });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products (seller only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, stock, brand, categoryId, isFeatured, isBestSeller } = req.body;
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      stock,
      brand,
      categoryId,
      images,
      isFeatured: isFeatured === "true",
      isBestSeller: isBestSeller === "true",
      sellerId: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id (seller who owns it, or admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    const fields = ["name", "description", "price", "discountPrice", "stock", "brand", "categoryId", "isFeatured", "isBestSeller"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });
    if (req.files && req.files.length) {
      product.images = req.files.map((f) => `/uploads/${f.filename}`);
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
