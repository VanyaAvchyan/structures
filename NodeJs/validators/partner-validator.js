const Joi = require('@hapi/joi');

const PartnerSchema = Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.valid('active', 'suspended', 'deleted').optional()
});

module.exports = PartnerSchema;