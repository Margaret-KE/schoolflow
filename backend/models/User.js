const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.ENUM("admin", "teacher", "parent"),
        allowNull: false
    },

    refresh_token: {
        type: DataTypes.TEXT
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    last_login: {
        type: DataTypes.DATE
    },

    phone: {
        type: DataTypes.STRING
    },

    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: "Users", // MUST match migration
    timestamps: true
});

module.exports = User;