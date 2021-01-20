const express = require('express');
const {RoleSchema} = require("../validators/validator-factory");

let router = express.Router();

module.exports = function (roleService, requestValidationMiddleware, authMiddleware) {

    router.post('/', authMiddleware.userAuth(["superAdmin", "admin"]),
        requestValidationMiddleware.bodyValidator(RoleSchema), async (req, res, next) => {
            try {
                let role = await roleService.createRole(req.body);
                res.status(201).successResponse(role);
            } catch (err) {
                return next(err);
            }
        });


    router.delete('/:role_id', authMiddleware.userAuth(["superAdmin", "admin"]),
         async (req, res, next) => {
            try {
                await roleService.deleteRoleById(req.params.role_id);
                res.status(202).successResponse({});
            } catch (err) {
                return next(err);
            }
        });

    router.get('/:role_id', authMiddleware.userAuth(["superAdmin", "admin"]), async (req, res, next) => {
        try {
            let role = await roleService.getRoleById(req.params.role_id);
            res.successResponse(role);
        } catch (err) {
            next(err);
        }
    });

    router.get('/', authMiddleware.userAuth(["superAdmin"]), async (req, res, next) => {
        try {
            let role = await roleService.getRoles();
            res.successResponse(role);
        } catch (err) {
            next(err);
        }
    });



    return router;
};
