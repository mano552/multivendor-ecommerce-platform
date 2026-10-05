const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getCart, addToCart, updateCartItem, removeCartItem } = require("../controllers/cartController");

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCartItem);
router.delete("/:id", protect, removeCartItem);

module.exports = router;
