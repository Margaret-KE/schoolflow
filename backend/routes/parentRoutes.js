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
    permission("parents:create"),
    createParent
);

router.get(
    "/",
    auth,
    permission("parents:view"),
    getParents
);

module.exports = router;