const express = require("express");
const { recordGrades, getClassGrades, getReportCard } = require("../controllers/grade.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.post("/", authorize("admin", "teacher"), recordGrades);
router.get("/", authorize("admin", "teacher"), getClassGrades);
router.get("/report-card/:studentId", authorize("admin", "teacher", "parent", "student"), getReportCard);

module.exports = router;
