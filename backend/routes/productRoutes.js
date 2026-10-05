const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { addReview } = require("../controllers/reviewController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("seller", "admin"), upload.array("images", 5), createProduct);
router.put("/:id", protect, authorize("seller", "admin"), upload.array("images", 5), updateProduct);
router.delete("/:id", protect, authorize("seller", "admin"), deleteProduct);
router.post("/:productId/reviews", protect, addReview);

module.exports = router;
