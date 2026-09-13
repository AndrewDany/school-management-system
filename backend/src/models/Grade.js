const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Grade = sequelize.define(
  "Grade",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    academicYear: { type: DataTypes.STRING, allowNull: false }, // e.g. "2026/2027"
    term: { type: DataTypes.STRING, allowNull: false }, // e.g. "Term 1"
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
    remarks: { type: DataTypes.STRING, allowNull: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    subjectId: { type: DataTypes.UUID, allowNull: false },
    classSectionId: { type: DataTypes.UUID, allowNull: false },
    recordedById: { type: DataTypes.UUID, allowNull: true },
  },
  {
    indexes: [
      { unique: true, fields: ["studentId", "subjectId", "term", "academicYear"] },
    ],
  }
);

module.exports = Grade;
