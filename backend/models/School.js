const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const School = sequelize.define("School", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,

    subscriptionPlan: {
        type: DataTypes.ENUM("basic", "pro", "enterprise"),
        defaultValue: "basic"
    },

    subscriptionStatus: {
        type: DataTypes.ENUM("active", "inactive", "trial", "suspended"),
        defaultValue: "trial"
    },

    subscriptionExpiresAt: DataTypes.DATE,

    isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    mpesaAccountRef: DataTypes.STRING
}, {
    tableName: "schools",
    timestamps: true
});

module.exports = School;