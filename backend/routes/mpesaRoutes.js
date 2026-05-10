const express = require("express");
const router = express.Router();

const {
    initiatePayment,
    mpesaCallback
} = require("../controllers/paymentController");

const auth = require("../middleware/authMiddleware");

// ===============================
// INITIATE PAYMENT (STK PUSH)
// ===============================
router.post(
    "/pay",
    auth,
    initiatePayment
);

// ===============================
// MPESA CALLBACK (PUBLIC WEBHOOK)
// ===============================
router.post(
    "/callback",
    mpesaCallback
);

module.exports = router;