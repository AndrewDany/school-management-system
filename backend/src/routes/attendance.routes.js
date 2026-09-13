const express = require("express");
const {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
} = require("../controllers/attendance.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.post("/", authorize("admin", "teacher"), markAttendance);
router.get("/", authorize("admin", "teacher"), getClassAttendance);
router.get("/student/:studentId", authorize("admin", "teacher", "parent", "student"), getStudentAttendance);

module.exports = router;
