// ===============================
// DASHBOARD CONTROLLER (FINAL - COMPATIBLE)
// ===============================

const User = require("../models/User");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Parent = require("../models/Parent");
const Attendance = require("../models/Attendance");
const { Sequelize, Op } = require("sequelize");

// ===============================
// GET DASHBOARD STATS
// ===============================
exports.getDashboardStats = async(req, res) => {
    try {
        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const school_id = req.user.school_id;

        // ===============================
        // PARALLEL QUERIES
        // ===============================
        const results = await Promise.all([
            Student.count({ where: { school_id } }),
            Parent.count({ where: { school_id } }),
            User.count({ where: { school_id, role: "teacher" } }),
            Payment.findAll({
                where: { school_id },
                attributes: [
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                    [Sequelize.fn("SUM", Sequelize.col("amount")), "total"]
                ],
                raw: true
            }),
            Attendance.findAll({
                where: { school_id },
                attributes: [
                    "status", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
                ],
                group: ["status"],
                raw: true
            })
        ]);

        const totalStudents = results[0];
        const totalParents = results[1];
        const totalTeachers = results[2];
        const paymentStats = results[3];
        const attendanceStats = results[4];

        // ===============================
        // PAYMENTS SAFE PARSE
        // ===============================
        let totalPayments = 0;
        let totalRevenue = 0;

        if (paymentStats && paymentStats.length > 0) {
            totalPayments = parseInt(paymentStats[0].count || 0);
            totalRevenue = parseFloat(paymentStats[0].total || 0);
        }

        // ===============================
        // ATTENDANCE SAFE PARSE
        // ===============================
        let present = 0;
        let absent = 0;

        if (attendanceStats && attendanceStats.length > 0) {
            attendanceStats.forEach(function(a) {
                if (a.status === "present") {
                    present = parseInt(a.count);
                } else if (a.status === "absent") {
                    absent = parseInt(a.count);
                }
            });
        }

        const attendanceChart = { present, absent };

        // ===============================
        // REVENUE CHART (LAST 6 MONTHS)
        // ===============================
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueRaw = await Payment.findAll({
            where: {
                school_id: school_id,
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            attributes: [
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
                [Sequelize.fn("SUM", Sequelize.col("amount")), "total"]
            ],
            group: ["month"],
            order: [
                [Sequelize.literal("month"), "ASC"]
            ],
            raw: true
        });

        const revenueChart = {
            labels: [],
            data: []
        };

        if (revenueRaw && revenueRaw.length > 0) {
            revenueRaw.forEach(function(r) {
                revenueChart.labels.push(r.month);
                revenueChart.data.push(parseFloat(r.total));
            });
        }

        // ===============================
        // FINAL RESPONSE
        // ===============================
        return res.json({
            success: true,
            data: {
                totalStudents: totalStudents,
                totalParents: totalParents,
                totalTeachers: totalTeachers,
                totalPayments: totalPayments,
                totalRevenue: totalRevenue,
                attendanceChart: attendanceChart,
                revenueChart: revenueChart
            }
        });

    } catch (error) {
        console.error("DASHBOARD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};