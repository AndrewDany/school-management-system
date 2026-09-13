const express = require("express");
const {
  createFeeStructure,
  listFeeStructures,
  deleteFeeStructure,
  recordPayment,
  listStudentPayments,
  getStudentBalance,
} = require("../controllers/fee.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.get("/structures", listFeeStructures);
router.post("/structures", authorize("admin"), createFeeStructure);
router.delete("/structures/:id", authorize("admin"), deleteFeeStructure);

router.post("/payments", authorize("admin"), recordPayment);
router.get("/payments/:studentId", authorize("admin", "parent", "student"), listStudentPayments);

router.get("/balance/:studentId", authorize("admin", "parent", "student"), getStudentBalance);

module.exports = router;
