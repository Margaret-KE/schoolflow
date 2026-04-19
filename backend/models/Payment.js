const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const School = require("./School");

const Payment = sequelize.define("Payment", {
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.STRING, // cash, mpesa, bank
        defaultValue: "cash"
    },
    transaction_ref: {
        type: DataTypes.STRING
    },
    term: {
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.INTEGER
    }
});

// Relationships
School.hasMany(Payment, { foreignKey: "school_id" });
Payment.belongsTo(School, { foreignKey: "school_id" });

Student.hasMany(Payment, { foreignKey: "student_id" });
Payment.belongsTo(Student, { foreignKey: "student_id" });

module.exports = Payment;