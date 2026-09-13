const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// The expected fee amount for a class, per term/year.
const FeeStructure = sequelize.define("FeeStructure", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  academicYear: { type: DataTypes.STRING, allowNull: false },
  term: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true }, // e.g. "Tuition + feeding"
  classSectionId: { type: DataTypes.UUID, allowNull: false },
});

module.exports = FeeStructure;
