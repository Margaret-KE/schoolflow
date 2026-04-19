const express = require("express");
const router = express.Router();

const {
    createStudent,
    getStudents,
    getMyChildren
} = require("../controllers/studentController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Admin & teacher
router.post("/", auth, role("admin", "teacher"), createStudent);
router.get("/", auth, role("admin", "teacher"), getStudents);

// Parent
router.get("/my-children", auth, role("parent"), getMyChildren);

module.exports = router;