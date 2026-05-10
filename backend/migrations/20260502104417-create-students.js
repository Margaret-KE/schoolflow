"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("students", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            admission_no: Sequelize.STRING,
            student_class: Sequelize.STRING,

            gender: Sequelize.ENUM("male", "female"),

            date_of_birth: Sequelize.DATEONLY,

            school_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "schools",
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            parent_id: Sequelize.INTEGER,

            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });

        await queryInterface.addConstraint("students", {
            fields: ["admission_no", "school_id"],
            type: "unique",
            name: "unique_admission_per_school"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("students");
    }
};