const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    // ===============================
    // MULTI-TENANT SAFETY
    // ===============================
    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    // ===============================
    // STUDENT DETAILS
    // ===============================
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    admission_no: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },

    student_class: {
        type: DataTypes.STRING,
        allowNull: false
    },

    gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true
    },

    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    // ===============================
    // PARENT RELATION
    // ===============================
    parent_id: {
        type: DataTypes.UUID,
        allowNull: true
    }

}, {
    tableName: "students",
    timestamps: true,

    indexes: [
        { fields: ["school_id"] },
        { fields: ["parent_id"] },
        { fields: ["admission_no"] }
    ]
});

module.exports = Student;