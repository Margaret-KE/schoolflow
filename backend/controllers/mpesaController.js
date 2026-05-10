const { stkPush } = require("../services/mpesaService");
const Payment = require("../models/Payment");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const User = require("../models/User");
const { sendSMS } = require("../services/smsService");

// ===============================
// INITIATE PAYMENT
// ===============================
exports.initiatePayment = async(req, res) => {
    try {
        const { phone, amount, student_id } = req.body;

        if (!phone || !amount || !student_id) {
            return res.status(400).json({
                message: "Phone, amount and student are required"
            });
        }

        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // ===============================
        // PHONE NORMALIZATION
        // ===============================
        let formattedPhone = phone;

        if (formattedPhone && formattedPhone.indexOf("0") === 0) {
            formattedPhone = "254" + formattedPhone.slice(1);
        }

        // ===============================
        // MPESA REQUEST
        // ===============================
        const response = await stkPush(formattedPhone, amount, {
            schoolId: req.user.school_id,
            userId: req.user.id
        });

        if (!response) {
            return res.status(500).json({
                message: "Failed to initiate STK push"
            });
        }

        const checkoutId =
            response.data && response.data.CheckoutRequestID ?
            response.data.CheckoutRequestID :
            response.data && response.data.CheckoutRequestId ?
            response.data.CheckoutRequestId :
            null;

        // ===============================
        // SAVE PAYMENT
        // ===============================
        const payment = await Payment.create({
            phone: formattedPhone,
            amount: amount,
            method: "mpesa",
            student_id: student_id,
            school_id: req.user.school_id,
            checkout_request_id: checkoutId,
            status: "pending"
        });

        return res.json({
            message: "STK Push sent",
            data: payment
        });

    } catch (error) {
        console.error(
            "MPESA INIT ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            message: "Payment failed",
            error: error && error.message ? error.message : "Unknown error"
        });
    }
};

// ===============================
// MPESA CALLBACK
// ===============================
exports.mpesaCallback = async(req, res) => {
    try {
        const body =
            req.body &&
            req.body.Body &&
            req.body.Body.stkCallback ?
            req.body.Body.stkCallback :
            null;

        if (!body) {
            return res.json({ message: "Invalid callback format" });
        }

        const checkoutId = body.CheckoutRequestID;
        const resultCode = body.ResultCode;

        if (!checkoutId) {
            return res.json({ message: "Missing checkout ID" });
        }

        const payment = await Payment.findOne({
            where: { checkout_request_id: checkoutId }
        });

        if (!payment) {
            return res.json({ message: "Payment not found" });
        }

        // ===============================
        // IDENTITY CHECK
        // ===============================
        if (payment.status === "success") {
            return res.json({ message: "Already processed" });
        }

        // ===============================
        // SUCCESS PAYMENT
        // ===============================
        if (resultCode === 0) {

            const metadata =
                body.CallbackMetadata &&
                body.CallbackMetadata.Item ?
                body.CallbackMetadata.Item :
                [];

            const mpesaReceipt =
                metadata.find(function(i) {
                    return i.Name === "MpesaReceiptNumber";
                });

            const amountPaid =
                metadata.find(function(i) {
                    return i.Name === "Amount";
                });

            await payment.update({
                transaction_id: mpesaReceipt && mpesaReceipt.Value ?
                    mpesaReceipt.Value :
                    null,
                amount: amountPaid && amountPaid.Value ?
                    amountPaid.Value :
                    payment.amount,
                status: "success"
            });

            // ===============================
            // SEND SMS TO PARENT
            // ===============================
            const student = await Student.findByPk(payment.student_id, {
                include: {
                    model: Parent,
                    include: User
                }
            });

            const parentPhone =
                student &&
                student.Parent &&
                student.Parent.User &&
                student.Parent.User.phone ?
                student.Parent.User.phone :
                null;

            if (parentPhone) {
                await sendSMS(
                    parentPhone,
                    "Payment received: KES " +
                    payment.amount +
                    " for " +
                    (student && student.name ? student.name : "student") +
                    ". Ref: " +
                    (mpesaReceipt && mpesaReceipt.Value ?
                        mpesaReceipt.Value :
                        "N/A")
                );
            }

        } else {
            await payment.update({
                status: "failed"
            });
        }

        return res.json({
            message: "Callback processed"
        });

    } catch (error) {
        console.error(
            "CALLBACK ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            message: "Callback error",
            error: error && error.message ? error.message : "Unknown error"
        });
    }
};