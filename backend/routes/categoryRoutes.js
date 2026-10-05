const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getCategories, createCategory, deleteCategory } = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", protect, authorize("admin"), createCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

module.exports = router;
