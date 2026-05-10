const express = require("express");
const router = express.Router();

const {
    initiatePayment,
    mpesaCallback,
    getPayments,
    getPaymentStats,
    createPayment,
    updatePayment,
    deletePayment
} = require("../controllers/paymentController");

const auth =
    require("../middleware/authMiddleware");

const permission =
    require("../middleware/permissionMiddleware");

const validatePayment =
    require("../validators/paymentValidator");

// ===============================
// INITIATE PAYMENT (MPESA STK)
// ===============================
router.post(
    "/pay",
    auth,
    permission("payments:create"),
    initiatePayment
);

// ===============================
// MPESA CALLBACK (PUBLIC WEBHOOK)
// ===============================
router.post(
    "/callback",
    mpesaCallback
);

// ===============================
// GET PAYMENTS
// ===============================
router.get(
    "/",
    auth,
    permission("payments:view"),
    getPayments
);

// ===============================
// PAYMENT STATS
// ===============================
router.get(
    "/stats",
    auth,
    permission("payments:stats"),
    getPaymentStats
);

// ===============================
// CREATE PAYMENT (MANUAL)
// ===============================
router.post(
    "/",
    auth,
    permission("payments:create"),
    validatePayment,
    createPayment
);

// ===============================
// UPDATE PAYMENT
// ===============================
router.put(
    "/:id",
    auth,
    permission("payments:update"),
    validatePayment,
    updatePayment
);

// ===============================
// DELETE PAYMENT
// ===============================
router.delete(
    "/:id",
    auth,
    permission("payments:delete"),
    deletePayment
);

module.exports = router;