const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const School = require("./School");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("admin", "teacher", "parent"),
        allowNull: false
    }
});

// Relationships
School.hasMany(User, { foreignKey: "school_id" });
User.belongsTo(School, { foreignKey: "school_id" });

module.exports = User;