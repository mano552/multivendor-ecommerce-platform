const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  requestRefund,
  getMyRefunds,
  getSellerRefunds,
  getAllRefunds,
  updateRefundStatus,
} = require("../controllers/refundController");

router.post("/", protect, requestRefund);
router.get("/my", protect, getMyRefunds);
router.get("/seller", protect, authorize("seller", "admin"), getSellerRefunds);
router.get("/all", protect, authorize("admin"), getAllRefunds);
router.put("/:id/status", protect, authorize("seller", "admin"), updateRefundStatus);

module.exports = router;
