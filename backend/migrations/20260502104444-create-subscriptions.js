"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("subscriptions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            school_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: "schools",
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            plan: {
                type: Sequelize.ENUM("trial", "basic", "pro"),
                defaultValue: "trial"
            },

            status: {
                type: Sequelize.ENUM("active", "expired", "suspended"),
                defaultValue: "active"
            },

            start_date: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },

            end_date: Sequelize.DATE,

            student_limit: {
                type: Sequelize.INTEGER,
                defaultValue: 50
            },

            last_payment_date: Sequelize.DATE,
            next_billing_date: Sequelize.DATE,
            mpesa_reference: Sequelize.STRING,

            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("subscriptions");
    }
};