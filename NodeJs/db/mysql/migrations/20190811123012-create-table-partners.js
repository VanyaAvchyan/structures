'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('partners', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      status: {
          type: Sequelize.ENUM,
          values: ["active", "suspended", "deleted"],
          defaultValue: "active"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('partners');
  }
};
