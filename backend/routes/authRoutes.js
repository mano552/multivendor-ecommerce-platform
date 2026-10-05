const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { signup, login, getProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getProfile);
router.put("/me", protect, upload.single("avatar"), updateProfile);

module.exports = router;
