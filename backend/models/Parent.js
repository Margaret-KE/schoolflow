const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Parent = sequelize.define("Parent", {
    occupation: DataTypes.STRING,
    address: DataTypes.TEXT
});

// Relationship
User.hasOne(Parent, { foreignKey: "user_id" });
Parent.belongsTo(User, { foreignKey: "user_id" });

module.exports = Parent;