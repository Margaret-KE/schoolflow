const jwt = require("jsonwebtoken");
const { User, School, Subscription } = require("../models");

// ===============================
// AUTH MIDDLEWARE
// ===============================
const authMiddleware = async(req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        const user = await User.findByPk(decoded.id);

        if (!user || !user.school_id) {
            return res.status(401).json({
                success: false,
                message: "Invalid user or tenant"
            });
        }

        const school = await School.findByPk(user.school_id);

        if (!school) {
            return res.status(401).json({
                success: false,
                message: "School not found"
            });
        }

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

        if (subscription.end_date && new Date(subscription.end_date) < new Date()) {

            await subscription.update({ status: "expired" });

            return res.status(403).json({
                success: false,
                message: "Subscription expired"
            });
        }

        // ===============================
        // ATTACH CONTEXT
        // ===============================
        req.user = {
            id: user.id,
            role: user.role,
            school_id: user.school_id
        };

        req.school = school;
        req.subscription = subscription;

        next();

    } catch (error) {

        console.error("AUTH ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

module.exports = authMiddleware;