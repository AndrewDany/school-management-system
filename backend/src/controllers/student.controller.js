const { Student, ClassSection, User } = require("../models");

async function createStudent(req, res) {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json(student);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not create student", error: err.message });
  }
}

async function listStudents(req, res) {
  const { classSectionId, status } = req.query;
  const where = {};
  if (classSectionId) where.classSectionId = classSectionId;
  if (status) where.status = status;

  const students = await Student.findAll({
    where,
    include: [{ model: ClassSection, as: "classSection" }],
    order: [["fullName", "ASC"]],
  });
  return res.json(students);
}

async function getStudent(req, res) {
  const student = await Student.findByPk(req.params.id, {
    include: [{ model: ClassSection, as: "classSection" }],
  });
  if (!student) return res.status(404).json({ message: "Student not found" });
  return res.json(student);
}

async function updateStudent(req, res) {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  await student.update(req.body);
  return res.json(student);
}

async function deleteStudent(req, res) {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  await student.destroy();
  return res.status(204).send();
}

// Link this student record to an existing user account (by email) so that
// user can log in (web or mobile) and see their own attendance/grades/fees.
async function linkAccount(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "email is required" });

  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "No user found with that email" });
  if (user.role !== "student") {
    return res.status(400).json({ message: "That account's role is not 'student'" });
  }

  await student.update({ userId: user.id });
  return res.json(student);
}

module.exports = {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  linkAccount,
};
