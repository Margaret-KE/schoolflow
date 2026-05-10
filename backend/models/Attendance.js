const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define("Attendance", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("present", "absent"),
        allowNull: false
    },

    // ===============================
    // UUID FOREIGN KEYS (FIXED)
    // ===============================
    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    student_id: {
        type: DataTypes.UUID,
        allowNull: false
    }

}, {
    tableName: "attendance",
    timestamps: true,
    indexes: [{
            unique: true,
            fields: ["student_id", "date", "school_id"]
        },
        { fields: ["school_id"] },
        { fields: ["student_id"] },
        { fields: ["date"] }
    ]
});

module.exports = Attendance;