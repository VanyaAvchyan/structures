'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('Seed partners');
    return queryInterface.bulkInsert('partners', [{
      id: 1,
      name: "RB_Partner",
      status:"active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('partners', null);
  }
};
