const Payment = require("../models/Payment");
const Student = require("../models/Student");
const { stkPush } = require("../services/mpesaService");

// ===============================
// INITIATE PAYMENT
// ===============================
exports.initiatePayment = async(req, res) => {
    try {
        var school_id = (req.school_id) ? req.school_id : (req.user ? req.user.school_id : null);

        if (!school_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        var phone = req.body.phone;
        var amount = req.body.amount;
        var student_id = req.body.student_id;
        var term = req.body.term;
        var year = req.body.year;

        if (!phone || !amount || !student_id) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const student = await Student.findOne({
            where: {
                id: student_id,
                school_id: school_id
            }
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const response = await stkPush(phone, amount);

        if (!response || !response.CheckoutRequestID) {
            return res.status(500).json({ message: "Failed to initiate STK push" });
        }

        const payment = await Payment.create({
            student_id: student_id,
            school_id: school_id,
            amount: amount,
            phone: phone,
            method: "mpesa",
            term: term || null,
            year: year || new Date().getFullYear(),
            status: "pending",
            checkout_request_id: response.CheckoutRequestID
        });

        return res.json({
            message: "STK Push initiated",
            payment: payment
        });

    } catch (error) {
        console.error(
            "INITIATE PAYMENT ERROR:",
            error && error.response && error.response.data ?
            error.response.data :
            error.message
        );

        return res.status(500).json({ error: "Payment failed" });
    }
};

// ===============================
// MPESA CALLBACK
// ===============================
exports.mpesaCallback = async(req, res) => {
    try {
        var body =
            req.body &&
            req.body.Body &&
            req.body.Body.stkCallback ?
            req.body.Body.stkCallback :
            null;

        if (!body) {
            return res.status(400).json({ message: "Invalid callback" });
        }

        const payment = await Payment.findOne({
            where: {
                checkout_request_id: body.CheckoutRequestID
            }
        });

        if (!payment) {
            return res.json({ message: "Payment not found" });
        }

        // idempotency via status
        if (payment.status !== "pending") {
            return res.json({ message: "Already processed" });
        }

        var receipt = null;

        if (body.CallbackMetadata && body.CallbackMetadata.Item) {
            var items = body.CallbackMetadata.Item;

            for (var i = 0; i < items.length; i++) {
                if (items[i].Name === "MpesaReceiptNumber") {
                    receipt = items[i].Value;
                    break;
                }
            }
        }

        if (body.ResultCode === 0) {
            await payment.update({
                status: "success",
                transaction_id: receipt,
                paid_at: new Date()
            });
        } else {
            await payment.update({
                status: "failed",
                failed_reason: body.ResultDesc || "Payment failed"
            });
        }

        return res.json({ message: "Callback processed" });

    } catch (error) {
        console.error("MPESA CALLBACK ERROR:", error.message);
        return res.status(500).json({ error: "Callback failed" });
    }
};

// ===============================
// GET PAYMENTS
// ===============================
exports.getPayments = async(req, res) => {
    try {
        var school_id = (req.school_id) ? req.school_id : (req.user ? req.user.school_id : null);

        const payments = await Payment.findAll({
            where: { school_id: school_id },
            include: [Student],
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.json(payments);

    } catch (error) {
        console.error("GET PAYMENTS ERROR:", error.message);
        return res.status(500).json({ error: "Failed to fetch payments" });
    }
};

// ===============================
// PAYMENT STATS
// ===============================
exports.getPaymentStats = async(req, res) => {
    try {
        var school_id = (req.school_id) ? req.school_id : (req.user ? req.user.school_id : null);

        const payments = await Payment.findAll({
            where: { school_id: school_id }
        });

        const totalRevenue = payments.reduce(function(sum, p) {
            return sum + Number(p.amount || 0);
        }, 0);

        return res.json({
            totalRevenue: totalRevenue,
            success: payments.filter(p => p.status === "success").length,
            pending: payments.filter(p => p.status === "pending").length,
            failed: payments.filter(p => p.status === "failed").length
        });

    } catch (error) {
        console.error("PAYMENT STATS ERROR:", error.message);
        return res.status(500).json({ error: "Failed to load stats" });
    }
};

// ===============================
// CREATE PAYMENT (MANUAL)
// ===============================
exports.createPayment = async(req, res) => {
    try {
        const payment = await Payment.create({
            school_id: req.user.school_id,
            student_id: req.body.student_id,
            amount: req.body.amount,
            phone: req.body.phone,
            method: req.body.method || "cash",
            status: req.body.status || "success",
            term: req.body.term || null,
            year: req.body.year || new Date().getFullYear()
        });

        return res.status(201).json({
            success: true,
            payment: payment
        });

    } catch (error) {
        console.error("CREATE PAYMENT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment"
        });
    }
};

// ===============================
// UPDATE PAYMENT
// ===============================
exports.updatePayment = async(req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                id: req.params.id,
                school_id: req.user.school_id
            }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        await payment.update(req.body);

        return res.json({
            success: true,
            payment: payment
        });

    } catch (error) {
        console.error("UPDATE PAYMENT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update payment"
        });
    }
};

// ===============================
// DELETE PAYMENT
// ===============================
exports.deletePayment = async(req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                id: req.params.id,
                school_id: req.user.school_id
            }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        await payment.destroy();

        return res.json({
            success: true,
            message: "Payment deleted"
        });

    } catch (error) {
        console.error("DELETE PAYMENT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete payment"
        });
    }
};

// ===============================
// EXPORT PAYMENTS CSV
// ===============================
exports.exportPaymentsCSV = async(req, res) => {

    try {

        const payments = await Payment.findAll({
            where: {
                school_id: req.user.school_id
            }
        });

        let csv =
            "Student,Amount,Status,Date\n";

        payments.forEach(function(p) {

            csv +=
                `${p.student_id},${p.amount},${p.status},${p.createdAt}\n`;
        });

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment("payments.csv");

        return res.send(csv);

    } catch (error) {

        return res.status(500).json({
            message: "Export failed"
        });
    }
};