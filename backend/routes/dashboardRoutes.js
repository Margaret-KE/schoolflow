const express = require("express");
const router = express.Router();
const { Subscription, Payment, Student } = require("../models");
const { Sequelize, Op } = require("sequelize");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// GET DASHBOARD ANALYTICS
// ===============================
router.get("/", authMiddleware, async(req, res) => {
    try {
        const school_id = req.user.school_id;

        // ===============================
        // BASIC METRICS (PARALLEL)
        // ===============================
        const [
            subscription,
            totalStudents,
            paymentStats
        ] = await Promise.all([
            Subscription.findOne({ where: { school_id } }),

            Student.count({ where: { school_id } }),

            Payment.findAll({
                where: { school_id },
                attributes: [
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "totalPayments"],
                    [Sequelize.fn("SUM", Sequelize.col("amount")), "totalRevenue"],
                    [
                        Sequelize.fn("SUM",
                            Sequelize.literal(`CASE WHEN status='success' THEN 1 ELSE 0 END`)
                        ),
                        "success"
                    ],
                    [
                        Sequelize.fn("SUM",
                            Sequelize.literal(`CASE WHEN status='pending' THEN 1 ELSE 0 END`)
                        ),
                        "pending"
                    ],
                    [
                        Sequelize.fn("SUM",
                            Sequelize.literal(`CASE WHEN status='failed' THEN 1 ELSE 0 END`)
                        ),
                        "failed"
                    ]
                ],
                raw: true
            })
        ]);

        const statsRaw = paymentStats[0] || {};

        // ===============================
        // LAST 6 MONTHS FILTER
        // ===============================
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        // ===============================
        // MONTHLY REVENUE (DB GROUPING)
        // ===============================
        const monthlyRevenueRaw = await Payment.findAll({
            where: {
                school_id,
                status: "success",
                createdAt: {
                    [Op.gte]: sixMonthsAgo }
            },
            attributes: [
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
                [Sequelize.fn("SUM", Sequelize.col("amount")), "revenue"]
            ],
            group: ["month"],
            order: [
                [Sequelize.literal("month"), "ASC"]
            ],
            raw: true
        });

        // ===============================
        // STUDENT GROWTH (DB GROUPING)
        // ===============================
        const studentGrowthRaw = await Student.findAll({
            where: {
                school_id,
                createdAt: {
                    [Op.gte]: sixMonthsAgo }
            },
            attributes: [
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "students"]
            ],
            group: ["month"],
            order: [
                [Sequelize.literal("month"), "ASC"]
            ],
            raw: true
        });

        // ===============================
        // FINAL RESPONSE
        // ===============================
        return res.json({
            success: true,
            data: {
                subscription,

                stats: {
                    totalStudents,
                    totalRevenue: Number(statsRaw.totalRevenue || 0),
                    totalPayments: Number(statsRaw.totalPayments || 0),
                    success: Number(statsRaw.success || 0),
                    pending: Number(statsRaw.pending || 0),
                    failed: Number(statsRaw.failed || 0)
                },

                charts: {
                    monthlyRevenue: monthlyRevenueRaw,
                    studentGrowth: studentGrowthRaw
                }
            }
        });

    } catch (error) {
        console.error("DASHBOARD ANALYTICS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard analytics"
        });
    }
});

module.exports = router;