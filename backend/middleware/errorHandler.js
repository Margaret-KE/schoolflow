// ===============================
// GLOBAL ERROR HANDLER (FINAL)
// ===============================
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // ===============================
    // LOG ERROR (PRODUCTION SAFE)
    // ===============================
    console.error("🔥 GLOBAL ERROR:", {
        message: err.message,
        status: statusCode,
        path: req.originalUrl,
        method: req.method,
        time: new Date().toISOString(),
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });

    // ===============================
    // SEQUELIZE VALIDATION
    // ===============================
    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.errors.map(e => e.message)
        });
    }

    // ===============================
    // UNIQUE CONSTRAINT
    // ===============================
    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
            success: false,
            message: "Duplicate entry detected",
            errors: err.errors.map(e => e.message)
        });
    }

    // ===============================
    // JWT ERRORS
    // ===============================
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired"
        });
    }

    // ===============================
    // CUSTOM APP ERRORS
    // ===============================
    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            message: err.message
        });
    }

    // ===============================
    // DEFAULT ERROR
    // ===============================
    return res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production" ?
            "Internal server error" : err.message
    });
};

module.exports = errorHandler;