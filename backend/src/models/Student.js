const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  admissionNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  gender: { type: DataTypes.ENUM("male", "female"), allowNull: true },
  guardianName: { type: DataTypes.STRING, allowNull: true },
  guardianPhone: { type: DataTypes.STRING, allowNull: true },
  guardianEmail: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  enrollmentDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  status: {
    type: DataTypes.ENUM("active", "inactive", "graduated", "withdrawn"),
    defaultValue: "active",
  },
  classSectionId: { type: DataTypes.UUID, allowNull: true }, // FK to ClassSection
  userId: { type: DataTypes.UUID, allowNull: true }, // optional linked login account
});

module.exports = Student;
