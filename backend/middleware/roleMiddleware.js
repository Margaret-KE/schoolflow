const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userRole = req.user.role;

        // ===============================
        // SUPER ADMIN BYPASS (SAAS UPGRADE)
        // ===============================
        if (userRole === "super_admin") {
            return next();
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};

module.exports = roleMiddleware;