'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      console.log('Seed roles');
      return queryInterface.bulkInsert('roles', [
          {
              id: 1,
              name: 'superAdmin',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: 2,
              name: 'admin',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: 3,
              name: 'manager',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: 4,
              name: 'member',
              createdAt: new Date(),
              updatedAt: new Date(),
          }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('roles', null, {});
  }
};
