const User = require("../models/User");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Result = require("../models/Result");
const Parent = require("../models/Parent");
const { Sequelize } = require("sequelize");


// 📊 GET DASHBOARD STATS
exports.getDashboardStats = async(req, res) => {
    try {
        const school_id = req.user.school_id;

        // 👨‍🎓 Total Students
        const totalStudents = await Student.count({
            where: { school_id }
        });

        // 👨‍👩‍👧 Total Parents
        const totalParents = await Parent.count({
            include: {
                model: User,
                where: { school_id }
            }
        });

        // 👩‍🏫 Total Teachers
        const totalTeachers = await User.count({
            where: { school_id, role: "teacher" }
        });

        // 💰 Total Payments
        const payments = await Payment.findAll({
            where: { school_id }
        });

        const totalPayments = payments.length;

        const totalRevenue = payments.reduce(
            (sum, p) => sum + parseFloat(p.amount),
            0
        );

        // 📊 Average Performance
        const results = await Result.findAll({
            where: { school_id }
        });

        const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
        const avgPerformance = results.length ?
            (totalMarks / results.length).toFixed(2) :
            0;

        res.json({
            totalStudents,
            totalParents,
            totalTeachers,
            totalPayments,
            totalRevenue,
            avgPerformance
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};