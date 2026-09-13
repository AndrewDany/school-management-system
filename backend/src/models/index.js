const sequelize = require("../config/db");
const User = require("./User");
const Student = require("./Student");
const ClassSection = require("./ClassSection");
const Subject = require("./Subject");
const TimetableEntry = require("./TimetableEntry");
const Attendance = require("./Attendance");
const Grade = require("./Grade");
const FeeStructure = require("./FeeStructure");
const FeePayment = require("./FeePayment");

// --- Students & Classes ---
ClassSection.hasMany(Student, { foreignKey: "classSectionId", as: "students" });
Student.belongsTo(ClassSection, { foreignKey: "classSectionId", as: "classSection" });

ClassSection.belongsTo(User, { foreignKey: "classTeacherId", as: "classTeacher" });
User.hasMany(ClassSection, { foreignKey: "classTeacherId", as: "classesTaught" });

Student.belongsTo(User, { foreignKey: "userId", as: "userAccount" });
User.hasOne(Student, { foreignKey: "userId", as: "studentProfile" });

// --- Timetable ---
ClassSection.hasMany(TimetableEntry, { foreignKey: "classSectionId", as: "timetableEntries" });
TimetableEntry.belongsTo(ClassSection, { foreignKey: "classSectionId", as: "classSection" });

Subject.hasMany(TimetableEntry, { foreignKey: "subjectId", as: "timetableEntries" });
TimetableEntry.belongsTo(Subject, { foreignKey: "subjectId", as: "subject" });

User.hasMany(TimetableEntry, { foreignKey: "teacherId", as: "timetableEntries" });
TimetableEntry.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });

// --- Attendance ---
Student.hasMany(Attendance, { foreignKey: "studentId", as: "attendanceRecords" });
Attendance.belongsTo(Student, { foreignKey: "studentId", as: "student" });

ClassSection.hasMany(Attendance, { foreignKey: "classSectionId", as: "attendanceRecords" });
Attendance.belongsTo(ClassSection, { foreignKey: "classSectionId", as: "classSection" });

User.hasMany(Attendance, { foreignKey: "recordedById", as: "attendanceRecorded" });
Attendance.belongsTo(User, { foreignKey: "recordedById", as: "recordedBy" });

// --- Grades ---
Student.hasMany(Grade, { foreignKey: "studentId", as: "grades" });
Grade.belongsTo(Student, { foreignKey: "studentId", as: "student" });

Subject.hasMany(Grade, { foreignKey: "subjectId", as: "grades" });
Grade.belongsTo(Subject, { foreignKey: "subjectId", as: "subject" });

ClassSection.hasMany(Grade, { foreignKey: "classSectionId", as: "grades" });
Grade.belongsTo(ClassSection, { foreignKey: "classSectionId", as: "classSection" });

User.hasMany(Grade, { foreignKey: "recordedById", as: "gradesRecorded" });
Grade.belongsTo(User, { foreignKey: "recordedById", as: "recordedBy" });

// --- Fees ---
ClassSection.hasMany(FeeStructure, { foreignKey: "classSectionId", as: "feeStructures" });
FeeStructure.belongsTo(ClassSection, { foreignKey: "classSectionId", as: "classSection" });

Student.hasMany(FeePayment, { foreignKey: "studentId", as: "feePayments" });
FeePayment.belongsTo(Student, { foreignKey: "studentId", as: "student" });

User.hasMany(FeePayment, { foreignKey: "recordedById", as: "paymentsRecorded" });
FeePayment.belongsTo(User, { foreignKey: "recordedById", as: "recordedBy" });

module.exports = {
  sequelize,
  User,
  Student,
  ClassSection,
  Subject,
  TimetableEntry,
  Attendance,
  Grade,
  FeeStructure,
  FeePayment,
};
