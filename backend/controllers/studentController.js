const db = require("../models");

// ===============================
// SAFE SCHOOL HELPER
// ===============================
function getSchoolId(req) {

    if (req.school_id) {
        return req.school_id;
    }

    if (req.user && req.user.school_id) {
        return req.user.school_id;
    }

    throw new Error("Missing school context");
}

// ===============================
// CREATE STUDENT
// ===============================
exports.createStudent = async(req, res) => {

    try {

        const school_id = getSchoolId(req);

        const {
            name,
            admission_no,
            className,
            gender,
            parent_id
        } = req.body;

        if (!name || !className) {
            return res.status(400).json({
                message: "Name and class required"
            });
        }

        // DUPLICATE ADMISSION
        if (admission_no) {

            const existing = await db.Student.findOne({
                where: {
                    admission_no,
                    school_id
                }
            });

            if (existing) {
                return res.status(400).json({
                    message: "Admission number already exists"
                });
            }
        }

        // SAFE PARENT
        let safeParent = null;

        if (parent_id) {

            const parent = await db.Parent.findOne({
                where: {
                    id: parent_id,
                    school_id
                }
            });

            if (parent) {
                safeParent = parent.id;
            }
        }

        const student = await db.Student.create({
            name,
            admission_no: admission_no || null,
            student_class: className,
            gender: gender || null,
            school_id,
            parent_id: safeParent
        });

        return res.status(201).json(student);

    } catch (error) {

        console.error("CREATE STUDENT ERROR:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ===============================
// GET STUDENTS
// ===============================
exports.getStudents = async(req, res) => {

    try {

        const school_id = getSchoolId(req);

        const students = await db.Student.findAll({

            where: {
                school_id
            },

            include: [{
                model: db.Parent,
                as: "parent",
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

        return res.json(students);

    } catch (error) {

        console.error("GET STUDENTS ERROR FULL:", error);


        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ===============================
// GET MY CHILDREN
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
                message: "Parent not found"
            });
        }

        const students = await db.Student.findAll({
            where: {
                parent_id: parent.id,
                school_id
            }
        });

        return res.json(students);

    } catch (error) {

        console.error("GET CHILDREN ERROR:", error.message);

        return res.status(500).json({
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

        const id = req.params.id;

        const {
            name,
            admission_no,
            className,
            gender,
            parent_id
        } = req.body;

        const student = await db.Student.findOne({
            where: {
                id,
                school_id
            }
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        let safeParent = null;

        if (parent_id) {

            const parent = await db.Parent.findOne({
                where: {
                    id: parent_id,
                    school_id
                }
            });

            if (parent) {
                safeParent = parent.id;
            }
        }

        await student.update({
            name: name || student.name,
            admission_no: admission_no || student.admission_no,
            student_class: className || student.student_class,
            gender: gender || student.gender,
            parent_id: safeParent
        });

        return res.json(student);

    } catch (error) {

        console.error("UPDATE STUDENT ERROR:", error.message);

        return res.status(500).json({
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

        const id = req.params.id;

        const student = await db.Student.findOne({
            where: {
                id,
                school_id
            }
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        await student.destroy();

        return res.json({
            message: "Student deleted"
        });

    } catch (error) {

        console.error("DELETE STUDENT ERROR:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};