const permissions = require("../config/permissions");

const permissionMiddleware = (...requiredPermissions) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userRole = req.user.role;

        if (userRole === "super_admin") {
            return next();
        }

        const rolePermissions = permissions[userRole];

        if (!rolePermissions) {
            return res.status(403).json({
                message: "Access denied (role not configured)"
            });
        }

        const hasPermission = requiredPermissions.some(p =>
            rolePermissions.includes(p)
        );

        if (!hasPermission) {
            return res.status(403).json({
                message: "Permission denied",
                required: requiredPermissions
            });
        }

        next();
    };
};

module.exports = permissionMiddleware;