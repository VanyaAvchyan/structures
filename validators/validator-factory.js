const PartnerSchema = require("./partner-validator");
const ApplicationSchema = require("./application-validator");
const RoleSchema = require("./role-validator");
const {UserSignInSchema, UserSignUpSchema,UserConnectSchema,
    UserInfoSchema,UserPasswordSchema, CreateUserSchema,
    FBSignInSchema,UserInvitationSchema,
    UserMangoesSchema} = require("./user-validator");
module.exports = {
    PartnerSchema,
    ApplicationSchema,
    UserSignInSchema,
    UserSignUpSchema,
    UserConnectSchema,
    UserInfoSchema,
    UserPasswordSchema,
    CreateUserSchema,
    RoleSchema,
    FBSignInSchema,
    UserInvitationSchema,
    UserMangoesSchema
};