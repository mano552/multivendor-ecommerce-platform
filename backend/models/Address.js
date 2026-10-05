const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Address = sequelize.define("Address", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address1: { type: DataTypes.STRING, allowNull: false },
  address2: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING },
  zipCode: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, defaultValue: "USA" },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});

module.exports = Address;
