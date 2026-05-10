const express = require("express");
const router = express.Router();

const {
    getPublicStats,
    getPublicFeatures
} = require("../controllers/publicController");

// Public (no auth)
router.get("/stats", getPublicStats);
router.get("/features", getPublicFeatures);

module.exports = router;