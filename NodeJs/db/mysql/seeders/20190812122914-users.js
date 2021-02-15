'use strict';
const uuidv4 = require('uuid/v4');
const argon2 = require('argon2');
module.exports = {
  up: async (queryInterface, Sequelize) => {
      console.log('Seed users');
      return queryInterface.bulkInsert('users', [{
          id        : 1,
          uuid      : uuidv4(),
          status    : "active",
          email     : "admin@admin.com",
          password  : await argon2.hash("123456"),
          provider  : "rebateMango",
          frequencyProgramLevelId  : null,
          countryId  : 1,
          partnerId  : 1,
          roleId  : 1,
          applicationId  : 1,
          createdAt : new Date(),
          updatedAt : new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null);
  }
};
