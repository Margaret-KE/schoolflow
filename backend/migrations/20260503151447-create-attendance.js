"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Attendance", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM("present", "absent"),
                allowNull: false
            },

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

        await queryInterface.addConstraint("Attendance", {
            fields: ["student_id", "date", "school_id"],
            type: "unique",
            name: "unique_attendance_per_day"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("Attendance");
    }
};