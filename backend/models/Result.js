const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const Subject = require("./Subject");
const School = require("./School");

const Result = sequelize.define("Result", {
    marks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    grade: {
        type: DataTypes.STRING
    },
    term: {
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.INTEGER
    }
});

// Relationships
School.hasMany(Result, { foreignKey: "school_id" });
Result.belongsTo(School, { foreignKey: "school_id" });

Student.hasMany(Result, { foreignKey: "student_id" });
Result.belongsTo(Student, { foreignKey: "student_id" });

Subject.hasMany(Result, { foreignKey: "subject_id" });
Result.belongsTo(Subject, { foreignKey: "subject_id" });

module.exports = Result;