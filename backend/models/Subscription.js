const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subscription = sequelize.define("Subscription", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    plan: {
        type: DataTypes.ENUM("trial", "basic", "pro"),
        defaultValue: "trial"
    },

    status: {
        type: DataTypes.ENUM("active", "expired", "suspended"),
        defaultValue: "active"
    },

    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,

    student_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 50
    },

    last_payment_date: DataTypes.DATE,
    next_billing_date: DataTypes.DATE,

    mpesa_reference: DataTypes.STRING
}, {
    tableName: "subscriptions",
    timestamps: true
});

module.exports = Subscription;