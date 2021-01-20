'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'suspended', 'deleted'],
        defaultValue: 'active'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provider: {
        type: Sequelize.ENUM,
        values: ["rebateMango", "facebook", "dummy"],
        defaultValue: "rebateMango"
      },
      frequencyProgramLevelId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      countryId: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      partnerId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {model: "partners", key: "id"}
      },
      roleId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {model: "roles", key: "id"}
      },
      externalId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mangoes : {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      isSubscribed: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      applicationId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {model: "applications", key: 'id'}
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
