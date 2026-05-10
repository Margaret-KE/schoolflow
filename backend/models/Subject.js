const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const School = require("./School");

const Subject = sequelize.define("Subject", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "subjects",
    timestamps: true,
    indexes: [
        { fields: ["school_id"] }
    ]
});

// ===============================
// SAAS RELATIONSHIP
// ===============================
School.hasMany(Subject, {
    foreignKey: "school_id",
    onDelete: "CASCADE"
});

Subject.belongsTo(School, {
    foreignKey: "school_id"
});

module.exports = Subject;