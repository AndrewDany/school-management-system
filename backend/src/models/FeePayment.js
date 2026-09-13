const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeePayment = sequelize.define("FeePayment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  academicYear: { type: DataTypes.STRING, allowNull: false },
  term: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  method: {
    type: DataTypes.ENUM("cash", "mobile_money", "bank_transfer", "cheque", "other"),
    defaultValue: "cash",
  },
  reference: { type: DataTypes.STRING, allowNull: true }, // e.g. MoMo transaction ID
  studentId: { type: DataTypes.UUID, allowNull: false },
  recordedById: { type: DataTypes.UUID, allowNull: true },
});

module.exports = FeePayment;
