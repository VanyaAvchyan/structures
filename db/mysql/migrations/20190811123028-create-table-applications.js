'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('applications', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false
      },
      appId : {
        type: Sequelize.STRING,
        unique:true
      },
      clientSecret: {
        type: Sequelize.STRING
      },
      publicKey: {
        type: Sequelize.TEXT
      },
      privateKey: {
        type: Sequelize.TEXT
      },
      partnerId : {
        type: Sequelize.INTEGER.UNSIGNED,
        references : {model: 'partners', key: 'id'}
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('applications');
  }
};
