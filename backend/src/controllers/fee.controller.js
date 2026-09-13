const { FeeStructure, FeePayment, Student, ClassSection } = require("../models");

// --- Fee structures (how much a class owes per term) ---
async function createFeeStructure(req, res) {
  try {
    const feeStructure = await FeeStructure.create(req.body);
    return res.status(201).json(feeStructure);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not create fee structure", error: err.message });
  }
}

async function listFeeStructures(req, res) {
  const { classSectionId } = req.query;
  const where = {};
  if (classSectionId) where.classSectionId = classSectionId;
  const structures = await FeeStructure.findAll({
    where,
    include: [{ model: ClassSection, as: "classSection" }],
    order: [["academicYear", "DESC"], ["term", "ASC"]],
  });
  return res.json(structures);
}

async function deleteFeeStructure(req, res) {
  const structure = await FeeStructure.findByPk(req.params.id);
  if (!structure) return res.status(404).json({ message: "Fee structure not found" });
  await structure.destroy();
  return res.status(204).send();
}

// --- Payments ---
async function recordPayment(req, res) {
  try {
    const payment = await FeePayment.create({ ...req.body, recordedById: req.user.id });
    return res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not record payment", error: err.message });
  }
}

async function listStudentPayments(req, res) {
  const payments = await FeePayment.findAll({
    where: { studentId: req.params.studentId },
    order: [["paymentDate", "DESC"]],
  });
  return res.json(payments);
}

// Expected fee (from the student's class fee structure) minus what they've paid,
// for a given term/year.
async function getStudentBalance(req, res) {
  const { studentId } = req.params;
  const { academicYear, term } = req.query;
  if (!academicYear || !term) {
    return res.status(400).json({ message: "academicYear and term query params are required" });
  }

  const student = await Student.findByPk(studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const structure = await FeeStructure.findOne({
    where: { classSectionId: student.classSectionId, academicYear, term },
  });
  const expected = structure ? parseFloat(structure.amount) : 0;

  const payments = await FeePayment.findAll({
    where: { studentId, academicYear, term },
  });
  const paid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return res.json({
    studentId,
    academicYear,
    term,
    expected,
    paid,
    balance: expected - paid,
    payments,
  });
}

module.exports = {
  createFeeStructure,
  listFeeStructures,
  deleteFeeStructure,
  recordPayment,
  listStudentPayments,
  getStudentBalance,
};
