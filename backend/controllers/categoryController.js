const { Category } = require("../models");

const getCategories = async (req, res) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json(categories);
};

const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const category = await Category.create({ name, icon, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
