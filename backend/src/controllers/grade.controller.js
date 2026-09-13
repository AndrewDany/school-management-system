const { Grade, Student, Subject } = require("../models");

// Bulk record grades for a class + subject + term.
// Body: { classSectionId, subjectId, academicYear, term, records: [{ studentId, score, remarks }] }
async function recordGrades(req, res) {
  try {
    const { classSectionId, subjectId, academicYear, term, records } = req.body;
    if (!classSectionId || !subjectId || !academicYear || !term || !Array.isArray(records)) {
      return res.status(400).json({
        message: "classSectionId, subjectId, academicYear, term and records[] are required",
      });
    }

    const results = [];
    for (const record of records) {
      const [entry, created] = await Grade.findOrCreate({
        where: { studentId: record.studentId, subjectId, term, academicYear },
        defaults: {
          classSectionId,
          score: record.score,
          remarks: record.remarks || null,
          recordedById: req.user.id,
        },
      });
      if (!created) {
        await entry.update({
          score: record.score,
          remarks: record.remarks !== undefined ? record.remarks : entry.remarks,
          recordedById: req.user.id,
        });
      }
      results.push(entry);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not save grades", error: err.message });
  }
}

// Grades for a class + subject + term (for entering/reviewing scores)
async function getClassGrades(req, res) {
  const { classSectionId, subjectId, academicYear, term } = req.query;
  if (!classSectionId || !subjectId || !academicYear || !term) {
    return res.status(400).json({
      message: "classSectionId, subjectId, academicYear and term query params are required",
    });
  }
  const grades = await Grade.findAll({
    where: { classSectionId, subjectId, academicYear, term },
  });
  return res.json(grades);
}

// A single student's report card: every subject's score for a given term
async function getReportCard(req, res) {
  const { studentId } = req.params;
  const { academicYear, term } = req.query;
  if (!academicYear || !term) {
    return res.status(400).json({ message: "academicYear and term query params are required" });
  }

  const grades = await Grade.findAll({
    where: { studentId, academicYear, term },
    include: [{ model: Subject, as: "subject" }],
    order: [[{ model: Subject, as: "subject" }, "name", "ASC"]],
  });

  const student = await Student.findByPk(studentId, {
    attributes: ["id", "fullName", "admissionNumber"],
  });

  const average =
    grades.length > 0
      ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length
      : null;

  return res.json({ student, academicYear, term, grades, average });
}

module.exports = { recordGrades, getClassGrades, getReportCard };
