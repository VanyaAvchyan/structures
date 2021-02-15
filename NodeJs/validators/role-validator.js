const Joi = require('@hapi/joi');

const RoleSchema = Joi.object().keys({
    // name: Joi.string().valid(["superAdmin", "admin", "manager", "member"]).required()
    role_id: Joi.number().required()
});

module.exports = RoleSchema;