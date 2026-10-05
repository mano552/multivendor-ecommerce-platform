const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  discountPrice: { type: DataTypes.FLOAT }, // original higher price shown as strikethrough
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  sold: { type: DataTypes.INTEGER, defaultValue: 0 },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  brand: { type: DataTypes.STRING }, // Dell, Apple, LG, Sony, Microsoft, etc.
  ratingsAverage: { type: DataTypes.FLOAT, defaultValue: 0 },
  ratingsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  isBestSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});

module.exports = Product;
