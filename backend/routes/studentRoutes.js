const express = require("express");
const router = express.Router();

const {
    createStudent,
    getStudents,
    getMyChildren,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const auth = require("../middleware/authMiddleware");
const tenant = require("../middleware/tenantMiddleware");
const subscription = require("../middleware/subscriptionMiddleware");
const permission = require("../middleware/permissionMiddleware");

// ===============================
// STUDENT ROUTES (SAAS CORE)
// ===============================
router.use(auth, tenant, subscription);

router.post(
    "/",
    permission("students:create"),
    createStudent
);

router.get(
    "/my-children",
    auth,
    getMyChildren
);

router.get(
    "/",
    permission("students:view"),
    getStudents
);

router.get(
    "/my-children",
    permission("students:view_own"),
    getMyChildren
);

router.put(
    "/:id",
    permission("students:edit"),
    updateStudent
);

router.delete(
    "/:id",
    permission("students:delete"),
    deleteStudent
);

module.exports = router;