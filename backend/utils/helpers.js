const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// PASSWORD HASH
// ===============================
const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// ===============================
// COMPARE PASSWORD
// ===============================
const comparePassword = async(password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

// ===============================
// SIGN JWT
// ===============================
const signToken = (payload, expiresIn = "15m") => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// ===============================
// SAFE NUMBER PARSER
// ===============================
const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
};

// ===============================
// SAFE DATE FORMAT (YYYY-MM-DD)
// ===============================
const formatDate = (date = new Date()) => {
    return new Date(date).toISOString().split("T")[0];
};

module.exports = {
    hashPassword,
    comparePassword,
    signToken,
    toNumber,
    formatDate
};