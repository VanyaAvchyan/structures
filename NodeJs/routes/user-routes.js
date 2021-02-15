const express = require('express');
const {UserInfoSchema,UserPasswordSchema, CreateUserSchema, RoleSchema,UserInvitationSchema,
UserMangoesSchema} = require("../validators/validator-factory");

let router = express.Router();


module.exports = function (userService, requestValidationMiddleware, authMiddleware) {

    router.put('/mangoes/expired', async (req,res, next)=>{
        try {
            await userService.updateUserExpiredMangoes();
            res.status(200).successResponse({});
        }catch (err) {
            return next(err);
        }
    });

    router.post('/restore-keys',
        async (req, res, next) => {
            try {
                 await userService.createUserRestoreKey(req.body.email);
                res.status(200).successResponse({});
            } catch (err) {
                return next(err);
            }
        });

    // Update auth user info
    router.post('/restore-keys/:key',
        async (req, res, next) => {
            try {
                let token=await userService.restoreUser(req.params.key);
                res.status(200).successResponse(token);
            } catch (err) {
                return next(err);
            }
        });

    // Update auth user info
    router.put('/me',
        authMiddleware.userAuth(),
        requestValidationMiddleware.bodyValidator(UserInfoSchema),
        async (req, res, next) => {
            try {
                let userInfo = await userService.updateUserInfo(req.user.user_id, req.body);
                res.status(200).successResponse(userInfo);
            } catch (err) {
                return next(err);
            }
        });

    // Update auth user info
    router.put('/me/password',
        authMiddleware.userAuth(),
        requestValidationMiddleware.bodyValidator(UserPasswordSchema),
        async (req, res, next) => {
            try {
                req.body.noPass= req.user.noPass;
                let userInfo = await userService.updateUserPassword(req.user.user_id, req.body);
                res.status(200).successResponse(userInfo);
            } catch (err) {
                return next(err);
            }
        });

    // Get all users
    router.get('/',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        async (req, res, next) => {
            try {
                let users = await userService.getAllUsers();
                res.successResponse(users);
            } catch (err) {
                return next(err);
            }
        });

    // Get auth user
    router.get('/me',
        authMiddleware.userAuth(),
        async (req, res, next) => {
            try {
                let userInfo = await userService.getById(req.user.user_id);
                res.successResponse(userInfo);
            } catch (err) {
                return next(err);
            }
        });

    router.get('/referrals', authMiddleware.userAuth([]),
        async (req, res, next) => {
            try {
                let referrals = await userService.getUserReferrals(req.user.user_id);
                res.status(200).successResponse(referrals);
            } catch (err) {
                return next(err);
            }
        });

    // Get user by id
    router.get('/:id',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        async (req, res, next) => {
            try {
                let users = await userService.getById(req.params.id);
                res.successResponse(users);
            } catch (err) {
                return next(err);
            }
        });

    // Create user
    router.post('/',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        requestValidationMiddleware.bodyValidator(CreateUserSchema),
        async (req, res, next) => {
            try {
                if(req.user.role == "admin") {
                    req.body.partner_id = req.user.partner_id;
                } else {
                    req.body.partner_id = req.body.partner_id || req.user.partner_id;
                }
                let user = await userService.createUser(req.user, req.body);
                res.status(201).successResponse(user);
            } catch (err) {
                return next(err);
            }
        });

    // Update user role
    router.put('/:user_id/roles/',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        requestValidationMiddleware.bodyValidator(RoleSchema),
        async (req, res, next) => {
            try {
                await userService.updateUserRoleById(req.params.user_id, req.body.role_id);
                res.status(202).successResponse({});
            } catch (err) {
                return next(err);
            }
        });

    // Update user role
    router.post('/referrals', authMiddleware.userAuth([]),
        requestValidationMiddleware.bodyValidator(UserInvitationSchema),
        async (req, res, next) => {
            try {
                await userService.sendInvitation(req.body , req.user);
                res.status(200).successResponse({}, "Invitation sent");
            } catch (err) {
                return next(err);
            }
        });




    router.put('/:userId/mangoes', authMiddleware.userAuth(["superAdmin"], true),
        requestValidationMiddleware.bodyValidator(UserMangoesSchema),
        async (req, res, next) => {
            try {
                await userService.updateUserMangoes(req.params.userId, req.body.mangoes, req.body.reason);
                res.status(200).successResponse({}, "Mangoes updated");
            } catch (err) {
                return next(err);
            }
        });

    return router;
};
