const express = require("express");
const {
  createClass,
  listClasses,
  getClass,
  updateClass,
  deleteClass,
} = require("../controllers/class.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", listClasses);
router.get("/:id", getClass);
router.post("/", authorize("admin"), createClass);
router.put("/:id", authorize("admin"), updateClass);
router.delete("/:id", authorize("admin"), deleteClass);

module.exports = router;
