const express = require("express");
const router = express.Router();

// ===============================
// MIDDLEWARE
// ===============================
const auth = require("../middleware/authMiddleware");
const tenant = require("../middleware/tenantMiddleware");
const subscription = require("../middleware/subscriptionMiddleware");

// ===============================
// PUBLIC ROUTES (NO AUTH)
// ===============================

// Auth & onboarding
router.use("/auth", require("./authRoutes"));
router.use("/schools", require("./schoolRoutes"));

// Public landing page data
router.use("/public", require("./publicRoutes"));

// 🔥 MPESA CALLBACKS (MUST BE PUBLIC)
router.use("/mpesa/callback", require("./mpesaCallback"));

// ===============================
// PROTECTED ROUTES (AUTH ONLY)
// ===============================
router.use(auth, tenant);

// ⚠️ IMPORTANT:
// Allow users to access subscription routes BEFORE subscription check
router.use("/subscriptions", require("./subscriptionRoutes"));
router.use("/mpesa/subscription", require("./mpesaSubscriptionRoutes"));

// ===============================
// SUBSCRIPTION-LOCKED ROUTES
// ===============================
router.use(subscription);

// Core SaaS features
router.use("/students", require("./studentRoutes"));
router.use("/parents", require("./parentRoutes"));
router.use("/attendance", require("./attendanceRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/dashboards", require("./dashboardRoutes"));

// ===============================
// ADMIN ROUTES
// ===============================
router.use("/admin", require("./adminRoutes"));

// ===============================
// HEALTH CHECK
// ===============================
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SchoolFlow API is running"
    });
});

module.exports = router;