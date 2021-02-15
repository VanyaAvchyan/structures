const Joi = require('@hapi/joi').extend(require('@hapi/joi-date')).extend(require('joi-phone-number'));

const UserSignInSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(5).required(),
    remember_me: Joi.boolean().optional()
});

const UserSignUpSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(5).required(),
    confirm_password: Joi.string().min(5).required(),
    partner_id: Joi.number().integer().optional(),
    country_code: Joi.string().optional(),
    remember_me: Joi.boolean().optional(),
    is_subscribed: Joi.boolean().optional(),
    ref_id: Joi.string().optional()
});

const UserConnectSchema = Joi.object().keys({
    user_id: Joi.string(),
    phone: Joi.string().min(5).optional(),
    email: Joi.string().min(3).optional()
});

const UserInfoSchema = Joi.object().keys({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    phone: Joi.string().phoneNumber({ format: 'e164' }).optional(),
    address: Joi.string().optional(),
    zip_code: Joi.string().optional(),
    birth_date : Joi.date().format("YYYY-MM-DD").optional(),
    address2:  Joi.string().optional(),
    city:  Joi.string().optional(),
});
const UserPasswordSchema = Joi.object().keys({
    current_password: Joi.string().min(5).optional(),
    new_password: Joi.string().min(5).required(),
    confirmed_password: Joi.string().min(5).required()
});

const CreateUserSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(5).required(),
    partner_id: Joi.number().integer().optional(),
    role_id: Joi.number().integer().required(),
    country_id: Joi.number().integer().optional()
});

const FBSignInSchema = Joi.object().keys({
    fb_token: Joi.string().required(),
    partner_id: Joi.number().integer().optional(),
    country_id: Joi.number().integer().optional(),
    is_subscribed: Joi.boolean().optional(),
});

const UserInvitationSchema = Joi.object().keys({
    referral_link: Joi.string().required(),
    email: Joi.string().required(),

});
const UserMangoesSchema = Joi.object().keys({
    mangoes: Joi.number().required(),
    reason: Joi.string().optional()
})

module.exports = {
    UserSignInSchema,
    UserSignUpSchema,
    UserConnectSchema,
    UserInfoSchema,
    CreateUserSchema,
    FBSignInSchema,
    UserInvitationSchema,
    UserPasswordSchema,
    UserMangoesSchema
};