const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Parent = sequelize.define("Parent", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    occupation: {
        type: DataTypes.STRING,
        allowNull: true
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: "parents",
    timestamps: true,
    indexes: [
        { fields: ["user_id"] },
        { fields: ["school_id"] }
    ]
});

module.exports = Parent;