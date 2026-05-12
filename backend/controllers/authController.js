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

        const {
            schoolName,
            name,
            email,
            password
        } = req.body;

        // ===============================
        // VALIDATION
        // ===============================
        if (!schoolName || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        // ===============================
        // CHECK EXISTING USER
        // ===============================
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
            end_date: new Date(
                Date.now() + trialDays * 86400000
            )
        });

        // ===============================
        // HASH PASSWORD
        // ===============================
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // ===============================
        // CREATE ADMIN USER
        // ===============================
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            school_id: school.id
        });

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
        // SAVE REFRESH TOKEN
        // ===============================
        await user.update({
            refreshToken
        });

        // ===============================
        // RESPONSE
        // ===============================
        return res.status(201).json({
            success: true,
            message: "School registered successfully",

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

        console.error(
            "REGISTER ERROR:",
            error.message
        );

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
        // CHECK SUBSCRIPTION
        // ===============================
        const subscription = await Subscription.findOne({
            where: {
                school_id: user.school_id
            }
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "No active subscription found"
            });
        }

        if (subscription.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Subscription inactive"
            });
        }

        // ===============================
        // CHECK EXPIRY
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
                message: "Subscription expired"
            });
        }

        // ===============================
        // GENERATE TOKENS
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
        // SAVE SESSION
        // ===============================
        await user.update({
            refreshToken,
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

        console.error(
            "LOGIN ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// ===============================
// REFRESH TOKEN
// ===============================
exports.refreshToken = async(req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // ===============================
        // VERIFY TOKEN
        // ===============================
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // ===============================
        // FIND USER
        // ===============================
        const user = await User.findByPk(decoded.id);

        if (!user ||
            user.refreshToken !== refreshToken
        ) {
            return res.status(403).json({
                success: false,
                message: "Invalid token"
            });
        }

        // ===============================
        // GENERATE NEW ACCESS TOKEN
        // ===============================
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

        console.error(
            "REFRESH TOKEN ERROR:",
            error.message
        );

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
                refreshToken: null
            });
        }

        return res.json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};