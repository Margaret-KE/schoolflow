const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Parent = require("../models/Parent");
const { Op } = require("sequelize");

// 🎯 Grade calculator (simple version)
const getGrade = (marks) => {
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "E";
};

// ➕ Add result
exports.addResult = async(req, res) => {
    try {
        const { student_id, subject_id, marks, term, year } = req.body;

        if (!req.user ? .school_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const grade = getGrade(marks);

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
            message: "Result added successfully",
            result
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 📊 Get all results (admin/teacher)
exports.getResults = async(req, res) => {
    try {
        if (!req.user ? .school_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const results = await Result.findAll({
            where: { school_id: req.user.school_id },
            include: [Student, Subject]
        });

        return res.json(results);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 👨‍👩‍👧 Parent view results
exports.getMyResults = async(req, res) => {
    try {
        const parent = await Parent.findOne({
            where: { user_id: req.user.id }
        });

        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        const students = await Student.findAll({
            where: {
                parent_id: parent.id,
                school_id: req.user.school_id
            }
        });

        const studentIds = students.map(s => s.id);

        const results = await Result.findAll({
            where: {
                student_id: {
                    [Op.in]: studentIds
                },
                school_id: req.user.school_id
            },
            include: [Subject]
        });

        return res.json(results);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 📈 Student report (per term)
exports.getStudentReport = async(req, res) => {
    try {
        const { student_id } = req.params;

        if (!req.user ? .school_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const results = await Result.findAll({
            where: {
                student_id,
                school_id: req.user.school_id
            },
            include: [Subject]
        });

        const total = results.reduce((sum, r) => sum + (r.marks || 0), 0);
        const average = results.length ? total / results.length : 0;

        return res.json({
            results,
            total,
            average
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};