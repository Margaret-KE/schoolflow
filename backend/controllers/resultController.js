const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Parent = require("../models/Parent");


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

        res.status(201).json({
            message: "Result added successfully",
            result
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 📊 Get all results (admin/teacher)
exports.getResults = async(req, res) => {
    try {
        const results = await Result.findAll({
            where: { school_id: req.user.school_id },
            include: [Student, Subject]
        });

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 👨‍👩‍👧 Parent view results
exports.getMyResults = async(req, res) => {
    try {
        const parent = await Parent.findOne({
            where: { user_id: req.user.id }
        });

        const students = await Student.findAll({
            where: { parent_id: parent.id }
        });

        const studentIds = students.map(s => s.id);

        const results = await Result.findAll({
            where: { student_id: studentIds },
            include: Subject
        });

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 📈 Student report (per term)
exports.getStudentReport = async(req, res) => {
    try {
        const { student_id } = req.params;

        const results = await Result.findAll({
            where: { student_id },
            include: Subject
        });

        const total = results.reduce((sum, r) => sum + r.marks, 0);
        const average = results.length ? total / results.length : 0;

        res.json({
            results,
            total,
            average
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};