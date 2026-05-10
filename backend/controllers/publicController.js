const { Student, Payment } = require("../models");

// ===============================
// PUBLIC STATS (LANDING PAGE)
// ===============================
exports.getPublicStats = async(req, res) => {
    try {
        const totalStudents = await Student.count();
        const totalRevenue = await Payment.sum("amount");

        res.json({
            success: true,
            data: {
                students: totalStudents,
                revenue: totalRevenue || 0,
                uptime: "99.9%"
            }
        });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

// ===============================
// FEATURES (OPTIONAL)
// ===============================
exports.getPublicFeatures = (req, res) => {
    res.json({
        success: true,
        data: [
            "Student Management",
            "Attendance Tracking",
            "MPESA Payments",
            "Parent Portal"
        ]
    });
};