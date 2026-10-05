const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("buyer", "seller", "admin"), defaultValue: "buyer" },
  phone: { type: DataTypes.STRING },
  zipCode: { type: DataTypes.STRING },
  address1: { type: DataTypes.STRING },
  address2: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING }, // uploaded profile picture path
  shopName: { type: DataTypes.STRING }, // only used when role = seller
  approved: { type: DataTypes.BOOLEAN, defaultValue: true }, // admin can approve sellers
  stripeCustomerId: { type: DataTypes.STRING }, // Stripe Customer, created on first saved card
  resetPasswordToken: { type: DataTypes.STRING },
  resetPasswordExpires: { type: DataTypes.DATE },
}, {
  timestamps: true,
});

module.exports = User;
