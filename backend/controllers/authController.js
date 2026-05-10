const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const School = require("../models/School");
const Subscription = require("../models/Subscription");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../services/tokenService");

// ===============================
// REGISTER SCHOOL + ADMIN
// ===============================
exports.register = async(req, res) => {
    try {
        const { schoolName, name, email, password } = req.body;

        if (!schoolName || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        // ===============================
        // CREATE SCHOOL
        // ===============================
        const school = await School.create({
            name: schoolName,
            email
        });

        // ===============================
        // CREATE TRIAL SUBSCRIPTION
        // ===============================
        const trialDays = 14;

        await Subscription.create({
            school_id: school.id,
            plan: "trial",
            status: "active",
            start_date: new Date(),
            end_date: new Date(Date.now() + trialDays * 86400000)
        });

        // ===============================
        // CREATE ADMIN USER
        // ===============================
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            school_id: school.id
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            school_id: user.school_id
        });

        const refreshToken = generateRefreshToken({
            id: user.id
        });

        await user.update({
            refreshToken: refreshToken // ✅ FIXED
        });

        return res.status(201).json({
            success: true,
            message: "School registered successfully",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                school_id: user.school_id
            }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

// ===============================
// LOGIN
// ===============================
exports.login = async(req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // ===============================
        // GENERATE JWT TOKEN
        // ===============================
        const token = jwt.sign({
                id: user.id,
                role: user.role,
                school_id: user.school_id
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d"
            }
        );

        // ===============================
        // SAVE REFRESH TOKEN
        // ===============================
        await user.update({
            refreshToken: token
        });

        // ===============================
        // RESPONSE
        // ===============================
        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                school_id: user.school_id
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

exports.login = async(req, res) => {

    try {

        const { email, password } = req.body;

        // ===============================
        // FIND USER
        // ===============================
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ===============================
        // PASSWORD CHECK
        // ===============================
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // ===============================
        // SUBSCRIPTION CHECK
        // ===============================
        const subscription = await Subscription.findOne({
            where: {
                school_id: user.school_id
            }
        });

        if (!subscription || subscription.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Subscription inactive. Please renew."
            });
        }

        // ===============================
        // SUBSCRIPTION EXPIRY
        // ===============================
        if (
            subscription.end_date &&
            new Date(subscription.end_date).getTime() < Date.now()
        ) {

            await subscription.update({
                status: "expired"
            });

            return res.status(403).json({
                success: false,
                message: "Subscription expired. Please renew."
            });
        }

        // ===============================
        // TOKENS
        // ===============================
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            school_id: user.school_id
        });

        const refreshToken = generateRefreshToken({
            id: user.id
        });

        // ===============================
        // UPDATE USER
        // ===============================
        await user.update({
            refreshToken: refreshToken,
            lastLogin: new Date()
        });

        // ===============================
        // RESPONSE
        // ===============================
        return res.status(200).json({
            success: true,
            message: "Login successful",

            accessToken,
            refreshToken,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                school_id: user.school_id
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// ===============================
//// REFRESH TOKEN
// ===============================
exports.refreshToken = async(req, res) => {;
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findByPk(decoded.id);

        if (!user || user.refreshToken !== refreshToken) { // ✅ FIXED FIELD
            return res.status(403).json({
                success: false,
                message: "Invalid token"
            });
        }

        const newAccessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            school_id: user.school_id
        });

        return res.json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Expired or invalid token"
        });
    }
};

// ===============================
// LOGOUT
// ===============================
exports.logout = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            await user.update({
                refreshToken: null // ✅ FIXED
            });
        }

        return res.json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
}