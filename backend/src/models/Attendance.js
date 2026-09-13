const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("present", "absent", "late", "excused"),
      allowNull: false,
      defaultValue: "present",
    },
    remarks: { type: DataTypes.STRING, allowNull: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    classSectionId: { type: DataTypes.UUID, allowNull: false },
    recordedById: { type: DataTypes.UUID, allowNull: true }, // teacher/admin User id
  },
  {
    indexes: [
      { unique: true, fields: ["studentId", "date"] }, // one record per student per day
    ],
  }
);

module.exports = Attendance;
