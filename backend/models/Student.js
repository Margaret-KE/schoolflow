const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Parent = sequelize.define("Parent", {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    // ===============================
    // LINKED USER ACCOUNT
    // ===============================
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    // ===============================
    // MULTI-TENANT SAFETY
    // ===============================
    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    // ===============================
    // PARENT DETAILS
    // ===============================
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    occupation: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    tableName: "parents",
    timestamps: true
});

module.exports = Parent;