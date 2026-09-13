const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// dayOfWeek: 1 = Monday ... 5 = Friday (adjust as needed)
const TimetableEntry = sequelize.define("TimetableEntry", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 7 },
  },
  startTime: { type: DataTypes.TIME, allowNull: false }, // e.g. "08:00"
  endTime: { type: DataTypes.TIME, allowNull: false }, // e.g. "08:45"
  classSectionId: { type: DataTypes.UUID, allowNull: false },
  subjectId: { type: DataTypes.UUID, allowNull: false },
  teacherId: { type: DataTypes.UUID, allowNull: true },
});

module.exports = TimetableEntry;
