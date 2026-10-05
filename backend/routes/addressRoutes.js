const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const router = express.Router();

router.get("/", protect, getAddresses);
router.post("/", protect, createAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id/set-default", protect, setDefaultAddress);

module.exports = router;
