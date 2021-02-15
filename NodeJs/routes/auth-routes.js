const express = require('express');
let router = express.Router();
const {UserSignInSchema, UserSignUpSchema, FBSignInSchema} = require("../validators/validator-factory");

module.exports = function (usersService, authMiddleware, requestValidationMiddleware) {

    router.post('/signin',
        requestValidationMiddleware.bodyValidator(UserSignInSchema),
        async (req, res, next) => {
            try {
                let user = await usersService.signIn(req.body);
                res.successResponse(user);
            } catch (err) {
                return next(err);
            }
        });

    router.post('/signup',
        requestValidationMiddleware.bodyValidator(UserSignUpSchema),
        async (req, res, next) => {
            try {
                req.body.white_label_id = req.header("X-White-Label-Id") || 0;
                let user = await usersService.signUp(req.body);
                res.successResponse(user);
            } catch (err) {
                return next(err);
            }
        });

    router.post('/fb/signin',
        requestValidationMiddleware.bodyValidator(FBSignInSchema),
        async (req, res, next) => {
            try {
                req.body.white_label_id = req.header("X-White-Label-Id") || 0;
                let user = await usersService.fbSignIn(req.body);
                res.successResponse(user);
            } catch (err) {
                return next(err);
            }
        });

    router.post("/signout",
        authMiddleware.userAuth([]),
        async (req, res, next) => {
            try {
                await usersService.logoutUser(req.token);
                res.successResponse({}, "Successfully signed out")
            } catch (err) {
                return next(err);
            }
        });

    router.post('/partners/signin',
        authMiddleware.applicationAuth,
        async (req, res, next) => {
            try {

                let user = await usersService.partnerSignIn(req.body.user_id ? req.body : null, req.application);
                res.setHeader('Data-Length', JSON.stringify(user).length);
                res.successResponse(user);
            } catch (err) {
                return next(err);
            }
        });

    return router;
};
