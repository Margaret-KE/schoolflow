"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("schools", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            email: {
                type: Sequelize.STRING
            },

            phone: {
                type: Sequelize.STRING
            },

            subscriptionPlan: {
                type: Sequelize.ENUM("basic", "pro", "enterprise"),
                defaultValue: "basic"
            },

            subscriptionStatus: {
                type: Sequelize.ENUM("active", "inactive", "trial", "suspended"),
                defaultValue: "trial"
            },

            subscriptionExpiresAt: {
                type: Sequelize.DATE
            },

            isLocked: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            mpesaAccountRef: {
                type: Sequelize.STRING
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Optional but useful indexes
        await queryInterface.addIndex("schools", ["subscriptionStatus"]);
        await queryInterface.addIndex("schools", ["subscriptionPlan"]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("schools");

        // Clean ENUMs (important for MySQL)
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_schools_subscriptionPlan";'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_schools_subscriptionStatus";'
        );
    }
};