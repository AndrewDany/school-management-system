const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// e.g. Grade 6 - Section A
const ClassSection = sequelize.define("ClassSection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  gradeLevel: { type: DataTypes.STRING, allowNull: false }, // e.g. "Grade 6", "JHS 2"
  section: { type: DataTypes.STRING, allowNull: false }, // e.g. "A", "B"
  academicYear: { type: DataTypes.STRING, allowNull: false }, // e.g. "2026/2027"
  classTeacherId: { type: DataTypes.UUID, allowNull: true }, // FK to User (teacher)
});

module.exports = ClassSection;
