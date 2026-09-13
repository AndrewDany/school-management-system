const { Attendance, Student } = require("../models");

// Bulk mark attendance for a whole class on a given date.
// Body: { classSectionId, date, records: [{ studentId, status, remarks }] }
async function markAttendance(req, res) {
  try {
    const { classSectionId, date, records } = req.body;
    if (!classSectionId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "classSectionId, date and records[] are required" });
    }

    const results = [];
    for (const record of records) {
      const [entry, created] = await Attendance.findOrCreate({
        where: { studentId: record.studentId, date },
        defaults: {
          classSectionId,
          status: record.status || "present",
          remarks: record.remarks || null,
          recordedById: req.user.id,
        },
      });
      if (!created) {
        await entry.update({
          status: record.status || entry.status,
          remarks: record.remarks !== undefined ? record.remarks : entry.remarks,
          recordedById: req.user.id,
        });
      }
      results.push(entry);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not save attendance", error: err.message });
  }
}

// Get attendance for a class on a specific date
async function getClassAttendance(req, res) {
  const { classSectionId, date } = req.query;
  if (!classSectionId || !date) {
    return res.status(400).json({ message: "classSectionId and date query params are required" });
  }
  const records = await Attendance.findAll({
    where: { classSectionId, date },
    include: [{ model: Student, as: "student", attributes: ["id", "fullName", "admissionNumber"] }],
  });
  return res.json(records);
}

// Get a single student's attendance history
async function getStudentAttendance(req, res) {
  const records = await Attendance.findAll({
    where: { studentId: req.params.studentId },
    order: [["date", "DESC"]],
  });
  return res.json(records);
}

module.exports = { markAttendance, getClassAttendance, getStudentAttendance };
