const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TrackingUpdate = sequelize.define("TrackingUpdate", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: {
    type: DataTypes.ENUM("processing", "shipped", "out_for_delivery", "delivered", "cancelled"),
    allowNull: false,
  },
  note: { type: DataTypes.STRING }, // e.g. carrier name, tracking number, or a short message
}, {
  timestamps: true,
});

module.exports = TrackingUpdate;
