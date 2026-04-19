const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const School = require("./School");
const Parent = require("./Parent");

const Student = sequelize.define("Student", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admission_no: DataTypes.STRING,
    class: DataTypes.STRING,
    gender: DataTypes.ENUM("male", "female"),
    date_of_birth: DataTypes.DATE
});

// Relationships
School.hasMany(Student, { foreignKey: "school_id" });
Student.belongsTo(School, { foreignKey: "school_id" });

Parent.hasMany(Student, { foreignKey: "parent_id" });
Student.belongsTo(Parent, { foreignKey: "parent_id" });

module.exports = Student;