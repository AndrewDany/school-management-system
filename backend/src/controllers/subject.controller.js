const { Subject } = require("../models");

async function createSubject(req, res) {
  try {
    const subject = await Subject.create(req.body);
    return res.status(201).json(subject);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not create subject", error: err.message });
  }
}

async function listSubjects(req, res) {
  const subjects = await Subject.findAll({ order: [["name", "ASC"]] });
  return res.json(subjects);
}

async function deleteSubject(req, res) {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ message: "Subject not found" });
  await subject.destroy();
  return res.status(204).send();
}

module.exports = { createSubject, listSubjects, deleteSubject };
