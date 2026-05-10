"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("parents", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },

            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Users", // MUST match exactly
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            school_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "schools", // ensure this table also uses UUID
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            phone: {
                type: Sequelize.STRING
            },

            occupation: {
                type: Sequelize.STRING
            },

            address: {
                type: Sequelize.TEXT
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("parents");
    }
};