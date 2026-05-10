'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // ===============================
        // ADD COLUMNS
        // ===============================
        await queryInterface.addColumn('payments', 'idempotency_key', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        });

        await queryInterface.addColumn('payments', 'processed', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        // ===============================
        // ADD INDEX (SAFE GUARD)
        // ===============================
        await queryInterface.addConstraint('payments', {
            fields: ['idempotency_key'],
            type: 'unique',
            name: 'unique_idempotency_key'
        });
    },

    async down(queryInterface, Sequelize) {
        // ===============================
        // REMOVE CONSTRAINT FIRST
        // ===============================
        await queryInterface.removeConstraint('payments', 'unique_idempotency_key');

        // ===============================
        // REMOVE COLUMNS
        // ===============================
        await queryInterface.removeColumn('payments', 'idempotency_key');
        await queryInterface.removeColumn('payments', 'processed');
    }
};