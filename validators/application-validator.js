const Joi = require('@hapi/joi');

const ApplicationSchema = Joi.object().keys({
    name: Joi.string().required(),
});

module.exports = ApplicationSchema;