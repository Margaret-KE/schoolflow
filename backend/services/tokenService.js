const jwt = require("jsonwebtoken");

// ===============================
// ACCESS TOKEN (SHORT LIVED)
// ===============================
const generateAccessToken = (user) => {
    if (!user || !user.id) return null;

    return jwt.sign({
            id: user.id,
            role: user.role,
            school_id: user.school_id
        },
        process.env.JWT_SECRET, {
            expiresIn: "15m",
            issuer: "SchoolFlow",
            audience: "schoolflow-api"
        }
    );
};

// ===============================
// REFRESH TOKEN (LONG LIVED)
// ===============================
const generateRefreshToken = (user) => {
    if (!user || !user.id) return null;

    return jwt.sign({
            id: user.id,
            type: "refresh"
        },
        process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
            issuer: "SchoolFlow",
            audience: "schoolflow-refresh"
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};