const express = require("express");
const router = express.Router();

const {
    createParent,
    getParents
} = require("../controllers/parentController");

const auth = require("../middleware/authMiddleware");
const permission = require("../middleware/permissionMiddleware");

// ===============================
// PARENT ROUTES (SAAS CORE)
// ===============================
router.post(
    "/",
    auth,
    createParent
);

router.get(
    "/",
    auth,
    getParents
);

module.exports = router;