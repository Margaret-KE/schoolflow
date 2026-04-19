const express = require("express");
const router = express.Router();

const {
    recordPayment,
    getPayments,
    getMyPayments,
    getStudentBalance
} = require("../controllers/feeController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Admin & Teacher
router.post("/", auth, role("admin", "teacher"), recordPayment);
router.get("/", auth, role("admin", "teacher"), getPayments);

// Parent
router.get("/my", auth, role("parent"), getMyPayments);

// Student balance
router.get("/student/:student_id", auth, getStudentBalance);

module.exports = router;