const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const School = require("./School");

const Subject = sequelize.define("Subject", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Relationships
School.hasMany(Subject, { foreignKey: "school_id" });
Subject.belongsTo(School, { foreignKey: "school_id" });

module.exports = Subject;