const express = require("express");
const { createSubject, listSubjects, deleteSubject } = require("../controllers/subject.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.get("/", listSubjects);
router.post("/", authorize("admin"), createSubject);
router.delete("/:id", authorize("admin"), deleteSubject);

module.exports = router;
