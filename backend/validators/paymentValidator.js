// validators/paymentValidator.js

// ===============================
// PAYMENT VALIDATOR (SAAS READY)
// ===============================

const validatePayment = (req, res, next) => {

    try {

        const {
            student_name,
            amount,
            status
        } = req.body;

        // ===============================
        // STUDENT NAME
        // ===============================
        if (!student_name ||
            typeof student_name !== "string" ||
            student_name.trim().length < 2
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid student name is required"
            });
        }

        // ===============================
        // AMOUNT
        // ===============================
        if (
            amount === undefined ||
            amount === null ||
            isNaN(amount)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid payment amount is required"
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        // ===============================
        // STATUS
        // ===============================
        const allowedStatuses = [
            "success",
            "pending",
            "failed"
        ];

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status"
            });
        }

        // ===============================
        // SANITIZE
        // ===============================
        req.body.student_name =
            student_name.trim();

        req.body.amount =
            Number(amount);

        if (!status) {
            req.body.status = "pending";
        }

        next();

    } catch (error) {

        console.error(
            "PAYMENT VALIDATION ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Validation failed"
        });

    }

};

module.exports = validatePayment;