const db = require("../models");
const plans = require("../utils/plans");

// ================= GET SUBSCRIPTION
// =================
exports.getMySubscription = async(req, res) => {
    try {
        const sub = await db.Subscription.findOne({
            where: { school_id: req.school_id }
        });

        return res.json({
            success: true,
            data: sub
        });
    } catch (err) {
        console.error("GET SUB ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to load subscription"
        });
    }
};

// ================= UPGRADE PLAN
// =================
exports.upgradePlan = async(req, res) => {
    try {
        const { plan } = req.body;

        if (!plans[plan]) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan"
            });
        }

        const planData = plans[plan];

        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await db.Subscription.update({
            plan,
            status: "active",
            student_limit: planData.students,
            start_date: new Date(),
            end_date: endDate,
            next_billing_date: endDate
        }, {
            where: { school_id: req.school_id }
        });

        return res.json({
            success: true,
            message: "Plan upgraded successfully"
        });
    } catch (err) {
        console.error("UPGRADE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Upgrade failed"
        });
    }
};