const express = require("express");
const router = express.Router();

const { createParent } = require("../controllers/parentController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Only admin can create parents
router.post("/", auth, role("admin"), createParent);

module.exports = router;