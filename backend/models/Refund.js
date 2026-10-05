const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Refund = sequelize.define("Refund", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reason: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
}, {
  timestamps: true,
});

module.exports = Refund;
