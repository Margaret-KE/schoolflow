"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Payments", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            method: {
                type: Sequelize.ENUM("cash", "mpesa", "bank"),
                defaultValue: "cash"
            },

            status: {
                type: Sequelize.ENUM("pending", "success", "failed"),
                defaultValue: "pending"
            },

            phone: Sequelize.STRING,

            checkout_request_id: {
                type: Sequelize.STRING,
                unique: true
            },

            transaction_id: Sequelize.STRING,

            term: Sequelize.STRING,
            year: Sequelize.INTEGER,

            fee_type: {
                type: Sequelize.STRING,
                defaultValue: "school_fees"
            },

            paid_at: Sequelize.DATE,
            failed_reason: Sequelize.TEXT,

            school_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "schools",
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            student_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "students",
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("Payments");
    }
};