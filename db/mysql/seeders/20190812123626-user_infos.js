'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      console.log('Seed user_infos');
      return queryInterface.bulkInsert('user_infos', [{
          id        : 1,
          firstName : "Super",
          lastName  : "Admin",
          phone     : null,
          address   : null,
          userId    : 1
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('user_infos', null, {});
  }
};
