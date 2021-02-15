const express = require('express');
const {PartnerSchema, ApplicationSchema} = require("../validators/validator-factory");

let router = express.Router();

module.exports = function (partnerService, authMiddleware, requestValidationMiddleware) {

    // Create Partner
    router.post('/',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        requestValidationMiddleware.bodyValidator(PartnerSchema),
        async (req, res, next) => {
            try {
                let partner = await partnerService.createPartner(req.body);
                res.status(201).successResponse(partner);
            } catch (err) {
                return next(err);
            }
        });
    // Update Partner By ID
    router.put('/:partner_id',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        requestValidationMiddleware.bodyValidator(PartnerSchema),
        async (req, res, next) => {
            try {
                let partner = await partnerService.updatePartnerByIdAndReturn(req.params.partner_id, req.body);
                res.status(202).successResponse(partner);
            } catch (err) {
                return next(err);
            }
        });

    // Delete Partner By ID
    router.delete('/:partner_id',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        async (req, res, next) => {
            try {
                await partnerService.deletePartnerById(req.params.partner_id);
                res.status(202).successResponse({});
            } catch (err) {
                return next(err);
            }
        });

    // Get Partner By ID
    router.get('/:partner_id',
        authMiddleware.userAuth(["superAdmin", "admin"], true),
        async (req, res, next) => {
        try {
            let partner = await partnerService.getPartnerById(req.params.partner_id);
            res.successResponse(partner);
        } catch (err) {
            next(err);
        }
    });

    // Get All Partners
    router.get('/',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        async (req, res, next) => {
        try {
            let partner = await partnerService.getPartners(req.query.except_status);
            res.successResponse(partner);
        } catch (err) {
            next(err);
        }
    });

    // Create Appclication for Partner
    router.post('/:partner_id/applications',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        requestValidationMiddleware.bodyValidator(ApplicationSchema),
        async (req, res, next) => {
            try {
                let app = req.body;
                app.partnerId = req.params.partner_id;
                let application = await partnerService.createApplication(app);
                return res.successResponse(application.excludeOnly(["privateKey"]));
            } catch (err) {
                return next(err)
            }
        });

    return router;
};
