"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
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
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false
            },

            role: {
                type: Sequelize.ENUM("admin", "teacher", "parent"),
                allowNull: false
            },

            refresh_token: {
                type: Sequelize.TEXT
            },

            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },

            last_login: {
                type: Sequelize.DATE
            },

            phone: {
                type: Sequelize.STRING
            },

            school_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "schools", // must also use UUID
                    key: "id"
                },
                onDelete: "CASCADE"
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

        // Optional but recommended: index for multi-tenant queries
        await queryInterface.addIndex("Users", ["school_id"]);
        await queryInterface.addIndex("Users", ["email"]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");

        // Clean ENUM (important for MySQL)
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_Users_role";'
        );
    }
};