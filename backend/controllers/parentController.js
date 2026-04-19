const bcrypt = require("bcrypt");
const User = require("../models/User");
const Parent = require("../models/Parent");

// Create Parent Account
exports.createParent = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "parent",
            school_id: req.user.school_id
        });

        const parent = await Parent.create({
            user_id: user.id
        });

        res.status(201).json({
            message: "Parent created successfully",
            parent,
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};