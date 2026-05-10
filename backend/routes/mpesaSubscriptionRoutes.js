const router = require("express").Router();

const ctrl = require("../controllers/mpesaSubscriptionController");
const auth = require("../middleware/authMiddleware");
const tenant = require("../middleware/tenantMiddleware");

// ===============================
// PROTECTED (MPESA SUBSCRIPTION)
// ===============================
router.use(auth, tenant);

// Trigger STK push for subscription
router.post("/pay", ctrl.paySubscription);

// ===============================
module.exports = router;