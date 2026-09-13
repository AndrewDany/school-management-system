const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subject = sequelize.define("Subject", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false }, // e.g. "Mathematics"
  code: { type: DataTypes.STRING, allowNull: true }, // e.g. "MATH"
});

module.exports = Subject;
