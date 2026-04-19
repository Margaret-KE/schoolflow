const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const School = sequelize.define("School", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    subscription_plan: {
        type: DataTypes.STRING,
        defaultValue: "basic"
    }
});

module.exports = School;