'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_infos', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      firstName : Sequelize.STRING(32),
      lastName : Sequelize.STRING(32),
      phone: {
        type: Sequelize.STRING,
        unique: true
      },
      address: Sequelize.STRING,
      address2: Sequelize.STRING,
      city: Sequelize.STRING,
      zipCode: Sequelize.STRING,
      birthDate: Sequelize.DATE,
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
        unique: true,
        references: {model: "users", key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_infos');
  }
};
