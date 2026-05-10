const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// ===============================
// TRANSACTION MODEL (SAAS - SQL SAFE)
// ===============================
const Transaction = sequelize.define("Transaction", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    plan: {
        type: DataTypes.STRING,
        allowNull: false
    },

    checkout_request_id: {
        type: DataTypes.STRING,
        unique: true
    },

    merchant_request_id: {
        type: DataTypes.STRING
    },

    status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "PENDING"
    },

    mpesa_receipt_number: {
        type: DataTypes.STRING,
        allowNull: true
    },

    raw_response: {
        type: DataTypes.JSON,
        allowNull: true
    }

}, {
    tableName: "transactions",
    timestamps: true,
    indexes: [
        { fields: ["school_id", "status"] },
        { unique: true, fields: ["checkout_request_id"] }
    ]
});

module.exports = Transaction;