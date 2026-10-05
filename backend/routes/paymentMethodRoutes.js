const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createSetupIntent,
  savePaymentMethod,
  getMyPaymentMethods,
  deletePaymentMethod,
} = require("../controllers/paymentMethodController");

router.post("/setup-intent", protect, createSetupIntent);
router.post("/", protect, savePaymentMethod);
router.get("/", protect, getMyPaymentMethods);
router.delete("/:id", protect, deletePaymentMethod);

module.exports = router;
