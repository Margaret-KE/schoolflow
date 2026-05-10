const jwt = require("jsonwebtoken");

// ===============================
// ACCESS TOKEN (SAAS SAFE)
// ===============================
exports.generateAccessToken = (user) => {
    return jwt.sign({
            id: user.id,
            role: user.role,
            school_id: user.school_id
        },
        process.env.JWT_SECRET, { expiresIn: "15m" }
    );
};

// ===============================
// REFRESH TOKEN
// ===============================
exports.generateRefreshToken = (user) => {
    return jwt.sign({
            id: user.id
        },
        process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }
    );
};