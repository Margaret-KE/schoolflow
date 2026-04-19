const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Only admin can access dashboard
router.get("/", auth, role("admin"), getDashboardStats);

module.exports = router;