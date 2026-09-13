const { ClassSection, Student, User } = require("../models");

async function createClass(req, res) {
  try {
    const classSection = await ClassSection.create(req.body);
    return res.status(201).json(classSection);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not create class", error: err.message });
  }
}

async function listClasses(req, res) {
  const classes = await ClassSection.findAll({
    include: [
      { model: User, as: "classTeacher", attributes: ["id", "fullName", "email"] },
      { model: Student, as: "students", attributes: ["id", "fullName"] },
    ],
    order: [["gradeLevel", "ASC"], ["section", "ASC"]],
  });
  return res.json(classes);
}

async function getClass(req, res) {
  const classSection = await ClassSection.findByPk(req.params.id, {
    include: [
      { model: User, as: "classTeacher", attributes: ["id", "fullName", "email"] },
      { model: Student, as: "students" },
    ],
  });
  if (!classSection) return res.status(404).json({ message: "Class not found" });
  return res.json(classSection);
}

async function updateClass(req, res) {
  const classSection = await ClassSection.findByPk(req.params.id);
  if (!classSection) return res.status(404).json({ message: "Class not found" });
  await classSection.update(req.body);
  return res.json(classSection);
}

async function deleteClass(req, res) {
  const classSection = await ClassSection.findByPk(req.params.id);
  if (!classSection) return res.status(404).json({ message: "Class not found" });
  await classSection.destroy();
  return res.status(204).send();
}

module.exports = { createClass, listClasses, getClass, updateClass, deleteClass };
