const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Parent = require("../models/Parent");
const { Op } = require("sequelize");

// ===============================
// GRADE CALCULATOR
// ===============================
const getGrade = (marks) => {

    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";

    return "E";
};

// ===============================
// ADD RESULT
// ===============================
exports.addResult = async(req, res) => {

    try {

        const {
            student_id,
            subject_id,
            marks,
            term,
            year
        } = req.body;

        // ===============================
        // AUTH CHECK
        // ===============================
        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // ===============================
        // VERIFY STUDENT
        // ===============================
        const student = await Student.findOne({
            where: {
                id: student_id,
                school_id: req.user.school_id
            }
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // ===============================
        // VERIFY SUBJECT
        // ===============================
        const subject = await Subject.findOne({
            where: {
                id: subject_id,
                school_id: req.user.school_id
            }
        });

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        // ===============================
        // CALCULATE GRADE
        // ===============================
        const grade = getGrade(marks);

        // ===============================
        // CREATE RESULT
        // ===============================
        const result = await Result.create({
            student_id,
            subject_id,
            school_id: req.user.school_id,
            marks,
            grade,
            term,
            year
        });

        return res.status(201).json({
            success: true,
            message: "Result added successfully",
            result
        });

    } catch (error) {

        console.error(
            "ADD RESULT ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// GET ALL RESULTS
// ===============================
exports.getResults = async(req, res) => {

    try {

        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const results = await Result.findAll({

            where: {
                school_id: req.user.school_id
            },

            include: [

                {
                    model: Student,

                    include: [{
                        model: Parent,
                        as: "parent",
                        required: false
                    }]
                },

                {
                    model: Subject
                }
            ],

            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.json(results);

    } catch (error) {

        console.error(
            "GET RESULTS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// PARENT VIEW RESULTS
// ===============================
exports.getMyResults = async(req, res) => {

    try {

        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // ===============================
        // FIND PARENT
        // ===============================
        const parent = await Parent.findOne({
            where: {
                user_id: req.user.id,
                school_id: req.user.school_id
            }
        });

        if (!parent) {
            return res.status(404).json({
                message: "Parent not found"
            });
        }

        // ===============================
        // FIND STUDENTS
        // ===============================
        const students = await Student.findAll({
            where: {
                parent_id: parent.id,
                school_id: req.user.school_id
            }
        });

        const studentIds = students.map(student => student.id);

        // ===============================
        // GET RESULTS
        // ===============================
        const results = await Result.findAll({

            where: {

                student_id: {
                    [Op.in]: studentIds
                },

                school_id: req.user.school_id
            },

            include: [

                {
                    model: Student,

                    include: [{
                        model: Parent,
                        as: "parent",
                        required: false
                    }]
                },

                {
                    model: Subject
                }
            ],

            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.json(results);

    } catch (error) {

        console.error(
            "GET MY RESULTS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// STUDENT REPORT
// ===============================
exports.getStudentReport = async(req, res) => {

    try {

        const { student_id } = req.params;

        if (!req.user || !req.user.school_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // ===============================
        // VERIFY STUDENT
        // ===============================
        const student = await Student.findOne({
            where: {
                id: student_id,
                school_id: req.user.school_id
            }
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // ===============================
        // GET RESULTS
        // ===============================
        const results = await Result.findAll({

            where: {
                student_id,
                school_id: req.user.school_id
            },

            include: [

                {
                    model: Subject
                },

                {
                    model: Student,

                    include: [{
                        model: Parent,
                        as: "parent",
                        required: false
                    }]
                }
            ],

            order: [
                ["createdAt", "DESC"]
            ]
        });

        // ===============================
        // REPORT SUMMARY
        // ===============================
        const total = results.reduce(
            (sum, result) => sum + (result.marks || 0),
            0
        );

        const average = results.length ?
            total / results.length :
            0;

        return res.json({
            success: true,
            results,
            total,
            average
        });

    } catch (error) {

        console.error(
            "GET STUDENT REPORT ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};