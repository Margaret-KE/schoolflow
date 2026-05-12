const permissions = require("../config/permissions");

const permissionMiddleware = (...requiredPermissions) => {

    return (req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            const userRole = req.user.role;

            const rolePermissions = permissions[userRole];

            if (!rolePermissions) {
                return res.status(403).json({
                    message: "Access denied (role not configured)"
                });
            }

            // SUPER ADMIN / WILDCARD
            if (rolePermissions.includes("*")) {
                return next();
            }

            // CHECK REQUIRED PERMISSIONS
            const hasPermission = requiredPermissions.some(permission =>
                rolePermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    message: "Permission denied",
                    required: requiredPermissions
                });
            }

            next();

        } catch (error) {

            console.error(
                "PERMISSION MIDDLEWARE ERROR:",
                error
            );

            return res.status(500).json({
                message: "Authorization failed"
            });
        }
    };
};

module.exports = permissionMiddleware;