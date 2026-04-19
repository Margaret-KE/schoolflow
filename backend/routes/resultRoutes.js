const express = require("express");
const router = express.Router();

const {
    addResult,
    getResults,
    getMyResults,
    getStudentReport
} = require("../controllers/resultController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Admin & Teacher
router.post("/", auth, role("admin", "teacher"), addResult);
router.get("/", auth, role("admin", "teacher"), getResults);

// Parent
router.get("/my", auth, role("parent"), getMyResults);

// Report
router.get("/student/:student_id", auth, getStudentReport);

module.exports = router;