const Payment = require("../models/Payment");
const Student = require("../models/Student");
const Parent = require("../models/Parent");


// ➕ Record Payment
exports.recordPayment = async(req, res) => {
    try {
        const { student_id, amount, method, transaction_ref, term, year } = req.body;

        const payment = await Payment.create({
            student_id,
            school_id: req.user.school_id,
            amount,
            method,
            transaction_ref,
            term,
            year
        });

        res.status(201).json({
            message: "Payment recorded successfully",
            payment
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 📊 Get all payments (admin/teacher)
exports.getPayments = async(req, res) => {
    try {
        const payments = await Payment.findAll({
            where: { school_id: req.user.school_id },
            include: Student
        });

        res.json(payments);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 👨‍👩‍👧 Parent: View child payments
exports.getMyPayments = async(req, res) => {
    try {
        // 1. Get parent record using logged-in user
        const parent = await Parent.findOne({
            where: { user_id: req.user.id }
        });

        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        // 2. Get all children of this parent
        const students = await Student.findAll({
            where: { parent_id: parent.id }
        });

        const studentIds = students.map(s => s.id);

        // 3. Get payments for those students
        const payments = await Payment.findAll({
            where: { student_id: studentIds }
        });

        res.json(payments);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};