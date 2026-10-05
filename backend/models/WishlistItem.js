const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WishlistItem = sequelize.define("WishlistItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
  timestamps: true,
});

module.exports = WishlistItem;
