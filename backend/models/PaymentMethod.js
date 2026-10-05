const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentMethod = sequelize.define("PaymentMethod", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  stripePaymentMethodId: { type: DataTypes.STRING, allowNull: false },
  brand: { type: DataTypes.STRING },     // visa, mastercard, etc.
  last4: { type: DataTypes.STRING },
  expMonth: { type: DataTypes.INTEGER },
  expYear: { type: DataTypes.INTEGER },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});

module.exports = PaymentMethod;
