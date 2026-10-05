const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getSellers,
  toggleSellerApproval,
  getStats,
  getAllProducts,
} = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/sellers", getSellers);
router.put("/sellers/:id/approve", toggleSellerApproval);
router.get("/stats", getStats);
router.get("/products", getAllProducts);

module.exports = router;
