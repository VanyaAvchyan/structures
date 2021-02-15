'use strict';
let shortId = require("shortid");
const { generateKeyPair } = require('crypto');
const Promise = require("bluebird");
const crypto = Promise.promisifyAll(require("crypto"));

function _generateKeyPair() {
    return new Promise((resolve, reject) => {
        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        }, (err, publicKey, privateKey) => {
            if (err) {
                return reject(err)
            }

            return resolve({
                public: publicKey,
                private: privateKey,
            })
        });
    })
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
      console.log('Seed applications');
      let pair = await _generateKeyPair();
      let secret =  await  crypto.randomBytesAsync(48);


      return queryInterface.bulkInsert('applications', [{
          id: 1,
          partnerId: 1,
          name: 'rebateMango',
          appId: shortId.generate(),
          clientSecret: secret.toString("hex"),
          publicKey: pair.public,
          privateKey: pair.private,
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('applications', null, {});
  }
};
