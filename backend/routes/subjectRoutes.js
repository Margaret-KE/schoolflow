const express = require("express");
const router = express.Router();

const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ===============================
// SUBJECT ROUTES (SAAS CORE)
// ===============================
router.post(
    "/",
    auth,
    role("admin"),
    createSubject
);

router.get(
    "/",
    auth,
    role("admin", "teacher"),
    getSubjects
);

router.put(
    "/:id",
    auth,
    role("admin"),
    updateSubject
);

router.delete(
    "/:id",
    auth,
    role("admin"),
    deleteSubject
);

module.exports = router;