const School = require("../models/School");
const Subscription = require("../models/Subscription");

// ===============================
// TENANT MIDDLEWARE (SAAS SECURITY FIXED)
// ===============================
const tenantMiddleware = async(req, res, next) => {
    try {
        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const school = await School.findByPk(req.user.school_id);

        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found"
            });
        }

        if (school.isLocked) {
            return res.status(403).json({
                success: false,
                message: "School account locked"
            });
        }

        // ===============================
        // SUBSCRIPTION ENFORCEMENT (IMPORTANT)
        // ===============================
        const subscription = await Subscription.findOne({
            where: { school_id: school.id }
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "No subscription found"
            });
        }

        if (subscription.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Subscription inactive"
            });
        }

        if (
            subscription.end_date &&
            new Date(subscription.end_date).getTime() < Date.now()
        ) {
            await subscription.update({ status: "expired" });

            return res.status(403).json({
                success: false,
                message: "Subscription expired"
            });
        }

        // ===============================
        // STANDARDIZED TENANT CONTEXT
        // ===============================
        req.school = school;
        req.school_id = school.id; // 🔥 IMPORTANT FIX
        req.subscription = subscription;

        next();

    } catch (error) {
        console.error("TENANT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Tenant validation failed"
        });
    }
};

module.exports = tenantMiddleware;