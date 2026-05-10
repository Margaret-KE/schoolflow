const router = require("express").Router();

const ctrl = require("../controllers/subscriptionController");
const auth = require("../middleware/authMiddleware");
const tenant = require("../middleware/tenantMiddleware");
const subscription = require("../middleware/subscriptionMiddleware");

// ===============================
// PROTECTED ROUTES (SAAS BILLING)
// ===============================
router.use(auth, tenant);

// Get current subscription
router.get("/", ctrl.getMySubscription);

// Upgrade / change plan
router.post("/upgrade", ctrl.upgradePlan);

// ===============================
module.exports = router;