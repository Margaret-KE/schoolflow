const db = require("../models");

// ===============================
// SAFE HELPERS
// ===============================
const getSchoolId = (req) => {
    if (!req.school_id) {
        throw new Error("Missing school context");
    }
    return req.school_id;
};

// ===============================
// CREATE STUDENT
// ===============================
exports.createStudent = async(req, res) => {
    try {
        const school_id = getSchoolId(req);

        const { name, admission_no, className, parent_id, gender } = req.body;

        if (!name || !className) {
            return res.status(400).json({
                success: false,
                message: "Name and class are required"
            });
        }

        // ===============================
        // SUBSCRIPTION LIMIT CHECK
        // ===============================
        const sub = await db.Subscription.findOne({
            where: { school_id }
        });

        const count = await db.Student.count({
            where: { school_id }
        });

        if (sub && sub.student_limit && count >= sub.student_limit) {
            return res.status(403).json({
                success: false,
                message: "Student limit reached. Upgrade plan."
            });
        }

        // ===============================
        // DUPLICATE ADMISSION CHECK
        // ===============================
        if (admission_no) {
            const existing = await db.Student.findOne({
                where: { admission_no, school_id }
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Admission number already exists"
                });
            }
        }

        // ===============================
        // SAFE PARENT VALIDATION
        // ===============================
        let safeParentId = null;

        if (parent_id) {
            const parent = await db.Parent.findOne({
                where: { id: parent_id, school_id },
                include: [{
                    model: db.User,
                    attributes: ["school_id"]
                }]
            });

            if (parent && parent.User && parent.User.school_id === school_id) {
                safeParentId = parent.id;
            }
        }

        const student = await db.Student.create({
            name,
            admission_no: admission_no || null,
            student_class: className,
            gender: gender || null,
            school_id,
            parent_id: safeParentId
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        console.error("CREATE STUDENT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// GET ALL STUDENTS
// ===============================
exports.getStudents = async(req, res) => {
    try {
        const school_id = getSchoolId(req);

        const students = await db.Student.findAll({
            where: { school_id },
            include: [{
                model: db.Parent,
                required: false,
                include: [{
                    model: db.User,
                    attributes: ["name"]
                }]
            }],
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error("GET STUDENTS ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// PARENT VIEW OWN CHILDREN
// ===============================
exports.getMyChildren = async(req, res) => {
    try {
        const school_id = getSchoolId(req);

        const parent = await db.Parent.findOne({
            where: {
                user_id: req.user.id,
                school_id
            }
        });

        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent not found"
            });
        }

        const students = await db.Student.findAll({
            where: {
                parent_id: parent.id,
                school_id
            }
        });

        return res.json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error("GET CHILDREN ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// UPDATE STUDENT
// ===============================
exports.updateStudent = async(req, res) => {
    try {
        const school_id = getSchoolId(req);
        const { id } = req.params;
        const { name, admission_no, className, gender, parent_id } = req.body;

        const student = await db.Student.findOne({
            where: { id, school_id }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        let safeParentId = student.parent_id;

        if (parent_id) {
            const parent = await db.Parent.findOne({
                where: { id: parent_id, school_id },
                include: [{
                    model: db.User,
                    attributes: ["school_id"]
                }]
            });

            if (parent && parent.User && parent.User.school_id === school_id) {
                safeParentId = parent.id;
            }
        }

        await student.update({
            name: name || student.name,
            admission_no: admission_no || student.admission_no,
            student_class: className || student.student_class,
            gender: gender || student.gender,
            parent_id: safeParentId
        });

        return res.json({
            success: true,
            message: "Student updated successfully",
            data: student
        });

    } catch (error) {
        console.error("UPDATE STUDENT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// DELETE STUDENT
// ===============================
exports.deleteStudent = async(req, res) => {
    try {
        const school_id = getSchoolId(req);
        const { id } = req.params;

        const student = await db.Student.findOne({
            where: { id, school_id }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await student.destroy();

        return res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("DELETE STUDENT ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};