const { Review, Product } = require("../models");

// POST /api/products/:productId/reviews
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      rating,
      comment,
      productId: product.id,
      userId: req.user.id,
    });

    const allReviews = await Review.findAll({ where: { productId: product.id } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.ratingsAverage = avg;
    product.ratingsCount = allReviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addReview };
