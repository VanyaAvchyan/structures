'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.ENUM,
        values: ["superAdmin", "admin", "manager", "member"],
        allowNull: false,
        unique: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('roles');
  }
};
