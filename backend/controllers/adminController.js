const db = require("../models");

exports.getAllSchools = async(req, res) => {
    const schools = await db.School.findAll({
        include: [db.Subscription]
    });

    res.json({ success: true, data: schools });
};

exports.getPlatformStats = async(req, res) => {
    const totalSchools = await db.School.count();
    const totalUsers = await db.User.count();
    const totalStudents = await db.Student.count();

    res.json({
        totalSchools,
        totalUsers,
        totalStudents
    });
};

exports.updateSchoolPlan = async(req, res) => {
    const { plan } = req.body;

    await db.Subscription.update({ plan }, { where: { schoolId: req.params.id } });

    res.json({ success: true });
};