const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Roles: admin, teacher, student, parent
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("admin", "teacher", "student", "parent"),
    allowNull: false,
    defaultValue: "student",
  },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = User;
