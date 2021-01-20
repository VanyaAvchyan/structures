const express = require('express');
let router = express.Router();


module.exports = function (applicationService, authMiddleware) {

    // Get public_key by appId
    router.get('/:appId/public_key',
        authMiddleware.serviceAuth,
        async(req, res, next)=>{
        try{
            let publicKey = await  applicationService.getPublicKey(req.params.appId);
            res.successResponse(publicKey);
        }catch (err){
            next(err);
        }
    });

    // Get by appId
    router.get('/:appId',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        async(req, res, next)=>{
        try{
            let app = await applicationService.getApplicationById(req.params.appId);
            res.successResponse(app);
        }catch (err){
            next(err);
        }
    });

    // Get all applications
    router.get('/',
        authMiddleware.userAuth(["superAdmin", "admin"]),
        async(req, res, next)=>{
        try{
            let apps = await  applicationService.getApplications();
            res.successResponse(apps);
        }catch (err){
            next(err);
        }
    });

    return router;
};
