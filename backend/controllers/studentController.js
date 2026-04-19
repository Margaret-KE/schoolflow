const Student = require("../models/Student");
const Parent = require("../models/Parent");

// Create Student
exports.createStudent = async(req, res) => {
    try {
        const { name, admission_no, className, parent_id } = req.body;

        const student = await Student.create({
            name,
            admission_no,
            class: className,
            parent_id,
            school_id: req.user.school_id
        });

        res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get students (admin/teacher)
exports.getStudents = async(req, res) => {
    try {
        const students = await Student.findAll({
            where: { school_id: req.user.school_id },
            include: Parent
        });

        res.json(students);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Parent view their children
exports.getMyChildren = async(req, res) => {
    try {
        const parent = await Parent.findOne({
            where: { user_id: req.user.id }
        });

        const students = await Student.findAll({
            where: { parent_id: parent.id }
        });

        res.json(students);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};