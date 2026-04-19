const bcrypt = require("bcrypt");
const User = require("../models/User");
const School = require("../models/School");
const generateToken = require("../utils/generateToken");


// REGISTER SCHOOL + ADMIN
exports.register = async(req, res) => {
    try {
        const { schoolName, name, email, password } = req.body;

        // Create school
        const school = await School.create({
            name: schoolName,
            email
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            school_id: school.id
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "School registered successfully",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// LOGIN (ALL USERS)
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};