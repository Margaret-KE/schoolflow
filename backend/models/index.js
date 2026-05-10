const sequelize = require("../config/db");

// ===============================
// IMPORT MODELS
// ===============================
const User = require("./User");
const School = require("./School");
const Student = require("./Student");
const Parent = require("./Parent");
const Attendance = require("./Attendance");
const Payment = require("./Payment");
const Subscription = require("./Subscription");

// ===============================
// SAFETY CHECK
// ===============================
if (!User ||
    !School ||
    !Student ||
    !Parent ||
    !Attendance ||
    !Payment ||
    !Subscription
) {
    throw new Error("One or more models failed to load");
}

// ===============================
// SCHOOL (TENANT ROOT)
// ===============================
School.hasMany(User, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Student, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Attendance, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Payment, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasOne(Subscription, { foreignKey: "school_id", onDelete: "CASCADE" });

// reverse safe binding
User.belongsTo(School, { foreignKey: "school_id" });
Student.belongsTo(School, { foreignKey: "school_id" });
Attendance.belongsTo(School, { foreignKey: "school_id" });
Payment.belongsTo(School, { foreignKey: "school_id" });
Subscription.belongsTo(School, { foreignKey: "school_id" });

// ===============================
// PARENT RELATIONS
// ===============================
Parent.belongsTo(User, {
    foreignKey: "user_id"
});

User.hasOne(Parent, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

Parent.belongsTo(School, {
    foreignKey: "school_id"
});

School.hasMany(Parent, {
    foreignKey: "school_id",
    onDelete: "CASCADE"
});

// ===============================
// STUDENT RELATIONS
// ===============================
Student.belongsTo(Parent, {
    foreignKey: "parent_id"
});

Parent.hasMany(Student, {
    foreignKey: "parent_id",
    onDelete: "SET NULL"
});

Student.hasMany(Attendance, {
    foreignKey: "student_id",
    onDelete: "CASCADE"
});

Attendance.belongsTo(Student, {
    foreignKey: "student_id"
});

Student.hasMany(Payment, {
    foreignKey: "student_id",
    onDelete: "CASCADE"
});

Payment.belongsTo(Student, {
    foreignKey: "student_id"
});
// ===============================
// EXPORT ALL
// ===============================
module.exports = {
    sequelize,
    User,
    School,
    Student,
    Parent,
    Attendance,
    Payment,
    Subscription
};