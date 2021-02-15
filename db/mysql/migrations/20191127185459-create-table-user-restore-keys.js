'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_restore_keys', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },{
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_restore_keys');
  }
};
