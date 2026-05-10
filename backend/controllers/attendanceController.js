const db = require("../models");
const { sendSMS } = require("../services/smsService");
const { Op } = require("sequelize");

// ===============================
// MARK ATTENDANCE
// ===============================
exports.markAttendance = async(req, res) => {
    try {
        const { student_id, status, date } = req.body;

        if (!student_id || !status) {
            return res.status(400).json({
                success: false,
                message: "Student and status are required"
            });
        }

        const safeDate = date || new Date().toISOString().split("T")[0];

        // Prevent duplicate
        const existing = await db.Attendance.findOne({
            where: {
                student_id: student_id,
                school_id: req.school_id,
                date: safeDate
            }
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked"
            });
        }

        const student = await db.Student.findOne({
            where: {
                id: student_id,
                school_id: req.school_id
            },
            include: [{
                model: db.Parent,
                include: [{ model: db.User }]
            }]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const attendance = await db.Attendance.create({
            student_id: student_id,
            status: status,
            date: safeDate,
            school_id: req.school_id
        });

        // SMS if absent
        if (
            status === "absent" &&
            student.Parent &&
            student.Parent.phone
        ) {
            await sendSMS(
                student.Parent.phone,
                student.name + " was marked ABSENT on " + safeDate
            );
        }

        return res.status(201).json({
            success: true,
            message: "Attendance recorded",
            data: attendance
        });

    } catch (error) {
        console.error(
            "MARK ATTENDANCE ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// GET ATTENDANCE
// ===============================
exports.getAttendance = async(req, res) => {
    try {
        const date = req.query.date;

        const where = {
            school_id: req.school_id
        };

        if (date) {
            where.date = date;
        }

        const records = await db.Attendance.findAll({
            where: where,
            include: [{
                model: db.Student,
                attributes: ["id", "name", "student_class"],
                include: [{
                    model: db.Parent,
                    include: [{
                        model: db.User,
                        attributes: ["name"]
                    }]
                }]
            }],
            order: [
                ["date", "DESC"]
            ]
        });

        return res.json({
            success: true,
            data: records
        });

    } catch (error) {
        console.error(
            "GET ATTENDANCE ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// UPDATE ATTENDANCE
// ===============================
exports.updateAttendance = async(req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const record = await db.Attendance.findOne({
            where: {
                id: id,
                school_id: req.school_id
            }
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });
        }

        await record.update({
            status: status || record.status
        });

        return res.json({
            success: true,
            message: "Attendance updated",
            data: record
        });

    } catch (error) {
        console.error(
            "UPDATE ATTENDANCE ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// DELETE ATTENDANCE
// ===============================
exports.deleteAttendance = async(req, res) => {
    try {
        const id = req.params.id;

        const record = await db.Attendance.findOne({
            where: {
                id: id,
                school_id: req.school_id
            }
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });
        }

        await record.destroy();

        return res.json({
            success: true,
            message: "Attendance deleted"
        });

    } catch (error) {
        console.error(
            "DELETE ATTENDANCE ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// ATTENDANCE STATS
// ===============================
exports.getAttendanceStats = async(req, res) => {
    try {
        const total = await db.Attendance.count({
            where: { school_id: req.school_id }
        });

        const present = await db.Attendance.count({
            where: {
                school_id: req.school_id,
                status: "present"
            }
        });

        const absent = await db.Attendance.count({
            where: {
                school_id: req.school_id,
                status: "absent"
            }
        });

        return res.json({
            success: true,
            data: {
                total: total,
                present: present,
                absent: absent,
                attendanceRate: total ?
                    ((present / total) * 100).toFixed(2) :
                    0
            }
        });

    } catch (error) {
        console.error(
            "ATTENDANCE STATS ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// PARENT ATTENDANCE VIEW
// ===============================
exports.getParentAttendance = async(req, res) => {
    try {
        const parent = await db.Parent.findOne({
            where: {
                user_id: req.user.id,
                school_id: req.school_id
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
                school_id: req.school_id
            }
        });

        const studentIds = students.map(function(s) {
            return s.id;
        });

        const records = await db.Attendance.findAll({
            where: {
                student_id: {
                    [Op.in]: studentIds
                },
                school_id: req.school_id
            },
            include: [db.Student],
            order: [
                ["date", "DESC"]
            ]
        });

        return res.json({
            success: true,
            data: records
        });

    } catch (error) {
        console.error(
            "PARENT ATTENDANCE ERROR:",
            error && error.message ? error.message : error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};