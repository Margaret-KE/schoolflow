const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    method: {
        type: DataTypes.ENUM("cash", "mpesa", "bank"),
        defaultValue: "mpesa"
    },

    status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        defaultValue: "pending"
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    checkout_request_id: {
        type: DataTypes.STRING,
        unique: true
    },

    transaction_id: {
        type: DataTypes.STRING
    },

    term: {
        type: DataTypes.STRING
    },

    year: {
        type: DataTypes.INTEGER
    },

    fee_type: {
        type: DataTypes.STRING,
        defaultValue: "school_fees"
    },

    paid_at: {
        type: DataTypes.DATE
    },

    failed_reason: {
        type: DataTypes.TEXT
    },

    // ===============================
    // 🔥 IDEMPOTENCY CORE
    // ===============================
    idempotency_key: {
        type: DataTypes.STRING,
        unique: true
    },

    processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // ===============================
    // SAAS CORE
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
    tableName: "payments",
    timestamps: true,
    indexes: [
        { unique: true, fields: ["checkout_request_id"] },
        { unique: true, fields: ["idempotency_key"] },
        { fields: ["school_id"] },
        { fields: ["student_id"] },
        { fields: ["status"] }
    ]
});

module.exports = Payment;