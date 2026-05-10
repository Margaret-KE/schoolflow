const User = require("./User");
const School = require("./School");
const Student = require("./Student");
const Parent = require("./Parent");
const Attendance = require("./Attendance");
const Payment = require("./Payment");
const Result = require("./Result");
const Subject = require("./Subject");

// ===============================
// SAFETY CHECK (SaaS STABILITY)
// ===============================
if (!User || !School || !Student || !Parent ||
    !Attendance || !Payment || !Result || !Subject
) {
    throw new Error("Model import failed in associations");
}

// ===============================
// SCHOOL RELATIONS (SAAS CORE)
// ===============================
School.hasMany(User, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Student, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Parent, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Attendance, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Payment, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Result, { foreignKey: "school_id", onDelete: "CASCADE" });
School.hasMany(Subject, { foreignKey: "school_id", onDelete: "CASCADE" });

// ===============================
// USER RELATIONS
// ===============================
User.belongsTo(School, { foreignKey: "school_id" });

// ===============================
// PARENT RELATIONS
// ===============================
User.hasOne(Parent, { foreignKey: "user_id", onDelete: "CASCADE" });
Parent.belongsTo(User, { foreignKey: "user_id" });
Parent.belongsTo(School, { foreignKey: "school_id" });

// ===============================
// STUDENT RELATIONS
// ===============================
Student.belongsTo(School, { foreignKey: "school_id" });
Student.belongsTo(Parent, { foreignKey: "parent_id" });

Parent.hasMany(Student, { foreignKey: "parent_id", onDelete: "SET NULL" });

// ===============================
// ATTENDANCE
// ===============================
Attendance.belongsTo(Student, { foreignKey: "student_id" });
Attendance.belongsTo(School, { foreignKey: "school_id" });

Student.hasMany(Attendance, { foreignKey: "student_id", onDelete: "CASCADE" });

// ===============================
// PAYMENTS
// ===============================
Payment.belongsTo(Student, { foreignKey: "student_id" });
Payment.belongsTo(School, { foreignKey: "school_id" });

Student.hasMany(Payment, { foreignKey: "student_id", onDelete: "CASCADE" });

// ===============================
// RESULTS
// ===============================
Result.belongsTo(Student, { foreignKey: "student_id" });
Result.belongsTo(School, { foreignKey: "school_id" });
Result.belongsTo(Subject, { foreignKey: "subject_id" });

Student.hasMany(Result, { foreignKey: "student_id", onDelete: "CASCADE" });

// ===============================
// SUBJECTS
// ===============================
Subject.belongsTo(School, { foreignKey: "school_id" });

// ===============================
// EXPORT ALL
// ===============================
module.exports = {
    User,
    School,
    Student,
    Parent,
    Attendance,
    Payment,
    Result,
    Subject
};
udent.hasMany(Payment, {
    foreignKey: "student_id",
    onDelete: "CASCADE"
});

// ===============================
// RESULTS
// ===============================
Result.belongsTo(Student, { foreignKey: "student_id" });
Result.belongsTo(School, { foreignKey: "school_id" });
Result.belongsTo(Subject, { foreignKey: "subject_id" });

Student.hasMany(Result, {
    foreignKey: "student_id",
    onDelete: "CASCADE"
});

// ===============================
// SUBJECTS
// ===============================
Subject.belongsTo(School, { foreignKey: "school_id" });

// ===============================
// EXPORT (CLEAN)
// ===============================
module.exports = {
    User,
    School,
    Student,
    Parent,
    Attendance,
    Payment,
    Result,
    Subject,
    Subscription
};