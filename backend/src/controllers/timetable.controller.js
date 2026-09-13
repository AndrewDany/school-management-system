const { Op } = require("sequelize");
const { TimetableEntry, Subject, User, ClassSection } = require("../models");

// Two time ranges overlap if start1 < end2 AND start2 < end1
async function findConflicts({ dayOfWeek, startTime, endTime, classSectionId, teacherId, excludeId }) {
  const overlapCondition = {
    dayOfWeek,
    startTime: { [Op.lt]: endTime },
    endTime: { [Op.gt]: startTime },
  };
  if (excludeId) overlapCondition.id = { [Op.ne]: excludeId };

  const classConflict = await TimetableEntry.findOne({
    where: { ...overlapCondition, classSectionId },
  });

  let teacherConflict = null;
  if (teacherId) {
    teacherConflict = await TimetableEntry.findOne({
      where: { ...overlapCondition, teacherId },
    });
  }

  return { classConflict, teacherConflict };
}

async function createEntry(req, res) {
  try {
    const { dayOfWeek, startTime, endTime, classSectionId, subjectId, teacherId } = req.body;
    if (!dayOfWeek || !startTime || !endTime || !classSectionId || !subjectId) {
      return res.status(400).json({
        message: "dayOfWeek, startTime, endTime, classSectionId and subjectId are required",
      });
    }
    if (startTime >= endTime) {
      return res.status(400).json({ message: "startTime must be before endTime" });
    }

    const { classConflict, teacherConflict } = await findConflicts({
      dayOfWeek,
      startTime,
      endTime,
      classSectionId,
      teacherId,
    });
    if (classConflict) {
      return res.status(409).json({ message: "This class already has a period scheduled at that time" });
    }
    if (teacherConflict) {
      return res.status(409).json({ message: "This teacher is already booked at that time" });
    }

    const entry = await TimetableEntry.create({ dayOfWeek, startTime, endTime, classSectionId, subjectId, teacherId });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Could not create timetable entry", error: err.message });
  }
}

async function listEntries(req, res) {
  const { classSectionId } = req.query;
  const where = {};
  if (classSectionId) where.classSectionId = classSectionId;

  const entries = await TimetableEntry.findAll({
    where,
    include: [
      { model: Subject, as: "subject" },
      { model: User, as: "teacher", attributes: ["id", "fullName"] },
      { model: ClassSection, as: "classSection" },
    ],
    order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]],
  });
  return res.json(entries);
}

async function deleteEntry(req, res) {
  const entry = await TimetableEntry.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ message: "Timetable entry not found" });
  await entry.destroy();
  return res.status(204).send();
}

module.exports = { createEntry, listEntries, deleteEntry };
