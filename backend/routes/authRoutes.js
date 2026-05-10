const express = require("express");
const router = express.Router();

const {
    register,
    login,
    refreshToken,
    logout
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

// ===============================
// AUTH ROUTES (SAAS CORE SAFE)
// ===============================

router.post("/register", (req, res) => register(req, res));
router.post("/login", (req, res) => login(req, res));
router.post("/refresh", (req, res) => refreshToken(req, res));
router.post("/logout", auth, (req, res) => logout(req, res));

module.exports = router;