const express = require("express");
const {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  linkAccount,
} = require("../controllers/student.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("admin", "teacher"), listStudents);
router.get("/:id", authorize("admin", "teacher", "parent", "student"), getStudent);
router.post("/", authorize("admin"), createStudent);
router.put("/:id", authorize("admin"), updateStudent);
router.post("/:id/link-account", authorize("admin"), linkAccount);
router.delete("/:id", authorize("admin"), deleteStudent);

module.exports = router;
