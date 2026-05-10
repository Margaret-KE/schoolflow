const Subscription = require("../models/Subscription");

// ===============================
// SUBSCRIPTION ENFORCEMENT (SAAS CORE - SECURE)
// ===============================
const subscriptionMiddleware = async(req, res, next) => {
    try {
        // ===============================
        // SUPER ADMIN BYPASS
        // ===============================
        if (req.user && req.user.role === "super_admin") {
            return next();
        }

        // ===============================
        // GET SCHOOL ID (SAFE SOURCE ONLY)
        // ===============================
        const schoolId =
            (req.tenant && req.tenant.school_id) ||
            (req.user && req.user.school_id);

        if (!schoolId) {
            return res.status(401).json({
                success: false,
                message: "Missing school context"
            });
        }

        // ===============================
        // GET SUBSCRIPTION (TENANT SAFE)
        // ===============================
        const subscription = await Subscription.findOne({
            where: { school_id: schoolId }
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "No subscription found"
            });
        }

        // ===============================
        // STATUS CHECK
        // ===============================
        if (subscription.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Subscription inactive. Please renew."
            });
        }

        // ===============================
        // EXPIRY CHECK
        // ===============================
        if (
            subscription.end_date &&
            new Date(subscription.end_date) < new Date()
        ) {
            // auto-mark expired (safe side-effect)
            await subscription.update({ status: "expired" });

            return res.status(403).json({
                success: false,
                message: "Subscription expired. Please renew."
            });
        }

        // ===============================
        // ATTACH TO REQUEST (SAFE)
        // ===============================
        req.subscription = subscription;

        next();

    } catch (error) {
        console.error("SUBSCRIPTION ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Subscription check failed"
        });
    }
};

module.exports = subscriptionMiddleware;