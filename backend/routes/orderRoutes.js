const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  placeCodOrder,
  createCheckoutSession,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderTracking,
  getSellerEarnings,
} = require("../controllers/orderController");

router.post("/cod", protect, placeCodOrder);
router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/my", protect, getMyOrders);
router.get("/seller/earnings", protect, authorize("seller"), getSellerEarnings);
router.get("/seller", protect, getSellerOrders);
router.get("/all", protect, authorize("admin"), getAllOrders);
router.get("/:id/tracking", protect, getOrderTracking);
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;
