const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/schoolController");
const auth = require("../middleware/authMiddleware");
const tenant = require("../middleware/tenantMiddleware");

// ===============================
// PUBLIC (ONBOARDING)
// ===============================
router.post("/", (req, res) => ctrl.createSchool(req, res));

// ===============================
// PROTECTED (SCHOOL MANAGEMENT)
// ===============================
router.get("/me", auth, tenant, (req, res) => ctrl.getMySchool(req, res));
router.put("/me", auth, tenant, (req, res) => ctrl.updateMySchool(req, res));

// ===============================
module.exports = router;