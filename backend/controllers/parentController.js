const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Parent = require("../models/Parent");

// ===============================
// CREATE PARENT (SAAS SAFE)
// ===============================
exports.createParent = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const existing = await User.findOne({ where: { email } });

        if (existing) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "parent",
            school_id: req.user.school_id
        });

        const parent = await Parent.create({
            user_id: user.id,
            phone: phone || null,
            school_id: req.user.school_id
        });

        return res.status(201).json({
            message: "Parent created successfully",
            parent,
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ===============================
// GET PARENTS (SAAS SCOPED)
// ===============================
exports.getParents = async(req, res) => {
    try {
        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const parents = await Parent.findAll({
            include: [{
                model: User,
                where: { school_id: req.user.school_id },
                attributes: ["id", "name", "email"]
            }]
        });

        return res.json(parents);

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};