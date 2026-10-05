const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.ENUM("card", "cod"), allowNull: false },
  paymentStatus: { type: DataTypes.ENUM("pending", "paid", "failed"), defaultValue: "pending" },
  stripeSessionId: { type: DataTypes.STRING },
  orderStatus: {
    type: DataTypes.ENUM("processing", "shipped", "out_for_delivery", "delivered", "cancelled"),
    defaultValue: "processing",
  },
  shippingFullName: { type: DataTypes.STRING, allowNull: false },
  shippingPhone: { type: DataTypes.STRING, allowNull: false },
  shippingAddress1: { type: DataTypes.STRING, allowNull: false },
  shippingAddress2: { type: DataTypes.STRING },
  shippingZip: { type: DataTypes.STRING, allowNull: false },
  shippingCity: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Order;
