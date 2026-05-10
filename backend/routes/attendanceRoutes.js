const express = require("express");
const router = express.Router();

const {
    markAttendance,
    getAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceStats,
    getParentAttendance
} = require("../controllers/attendanceController");

const auth = require("../middleware/authMiddleware");
const tenant = require("../middleware/tenantMiddleware");
const subscription = require("../middleware/subscriptionMiddleware");
const permission = require("../middleware/permissionMiddleware");

// ===============================
// ATTENDANCE ROUTES (SAAS CORE)
// ===============================
router.use(auth, tenant, subscription);

router.post(
    "/",
    permission("attendance:mark"),
    markAttendance
);

router.get(
    "/",
    permission("attendance:view"),
    getAttendance
);

router.get(
    "/stats",
    permission("attendance:view"),
    getAttendanceStats
);

router.get(
    "/parent",
    permission("attendance:view_own"),
    getParentAttendance
);

router.put(
    "/:id",
    permission("attendance:edit"),
    updateAttendance
);

router.delete(
    "/:id",
    permission("attendance:delete"),
    deleteAttendance
);

module.exports = router;