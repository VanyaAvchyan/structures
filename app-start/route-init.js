module.exports = (app) => {
    return require("./service-init").then(services => {
        const authMiddleware = require("../middlewares/auth-middleware")(services.securityService);
        const requestValidationMiddleware = require("../middlewares/request-validation-middleware")();

        const partnerRoutes = require('../routes/partner-routes')(services.partnerService, authMiddleware,
            requestValidationMiddleware);
        const authRoutes = require("../routes/auth-routes")(services.userService, authMiddleware,
            requestValidationMiddleware);
        const applicationRoutes = require("../routes/application-routes")(services.applicationService, authMiddleware);
        const userRoutes = require("../routes/user-routes")(services.userService, requestValidationMiddleware, authMiddleware);
        const roleRoutes = require("../routes/role-routes")(services.roleService, requestValidationMiddleware, authMiddleware);

        app.use('/partners', partnerRoutes);
        app.use('/auth', authRoutes);
        app.use('/applications', applicationRoutes);
        app.use('/users', userRoutes);
        app.use('/roles', roleRoutes);

        return app;
    })
};


