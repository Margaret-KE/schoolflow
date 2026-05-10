const db = require("../models");

// ================= CREATE SCHOOL (OPTIONAL API)
// =================
exports.createSchool = async(req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const school = await db.School.create({
            name,
            email,
            phone: phone || null
        });

        return res.status(201).json({
            success: true,
            data: school
        });
    } catch (err) {
        console.error("CREATE SCHOOL ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create school"
        });
    }
};

// ================= GET CURRENT SCHOOL
// =================
exports.getMySchool = async(req, res) => {
    try {
        const school = await db.School.findOne({
            where: { id: req.school_id },
            include: [{
                model: db.Subscription
            }]
        });

        return res.json({
            success: true,
            data: school
        });
    } catch (err) {
        console.error("GET SCHOOL ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to load school"
        });
    }
};

// ================= UPDATE SCHOOL
// =================
exports.updateMySchool = async(req, res) => {
    try {
        await db.School.update(req.body, {
            where: { id: req.school_id }
        });

        const updated = await db.School.findOne({
            where: { id: req.school_id }
        });

        return res.json({
            success: true,
            data: updated
        });
    } catch (err) {
        console.error("UPDATE SCHOOL ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
};