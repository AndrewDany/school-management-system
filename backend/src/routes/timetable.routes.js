const express = require("express");
const { createEntry, listEntries, deleteEntry } = require("../controllers/timetable.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.get("/", listEntries);
router.post("/", authorize("admin"), createEntry);
router.delete("/:id", authorize("admin"), deleteEntry);

module.exports = router;
