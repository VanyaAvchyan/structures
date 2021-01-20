const {ErrorType} = require('../helpers/enums');
const AppError = require('../helpers/appError');
const jwt = require("jsonwebtoken");
const request = require("request-promise");
const cache = require("../helpers/nodeCache");
const logger = require("../helpers/logger");
const config = require('config');

module.exports = function (securityService) {
    return {
        applicationAuth: async (req, res, next) => {
            if (!(req.body["client_id"] && req.body["client_secret"])) {
                return next(new AppError('App id and secret are required', ErrorType.invalid_request));
            }
            req.application = {
                id: req.body["client_id"],
                secret: req.body["client_secret"]
            };
            delete req.body.client_id;
            delete req.body.client_secret;
            next();
        },


        serviceAuth: async (req, res, next) => {
            try {
                let secret = await securityService.getServiceSecret();
                let token = req.headers['x-privacy-secret'];
                if (!token) {
                    return next(new AppError('Secret is not provided', ErrorType.unauthorized));
                }
                if (token !== secret) {
                    return next(new AppError('Invalid token', ErrorType.unauthorized))
                }
                next();
            } catch (e) {
                next(e)
            }
        },

        userAuth: (roles = [], allowService = false) => {
            return async (req, res, next) => {
                let appPort = config.get('api-config').port;
                if (allowService) {
                    try {
                        let secret = await securityService.getServiceSecret();
                        let token = req.headers['x-privacy-secret'];

                        if (token && token === secret) {
                            return next();
                        }
                    } catch (e) {
                        logger.warn(e.message);
                    }
                }

                if (!req.token) {
                    return next(new AppError('access_token required', ErrorType.unauthorized));
                }
                let blacklisted = await securityService.checkTokenBlackList(req.token);
                if(blacklisted){
                    return next(new AppError('invalid token', ErrorType.unauthorized));
                }

                let decoded = jwt.decode(req.token);
                if (!decoded || !decoded.app_id) {
                    return next(new AppError('invalid access_token', ErrorType.unauthorized));
                }

                try {
                    let publicKey = await cache.get(`application:pubKey:${decoded.app_id}`);
                    if (!publicKey) {
                        let response = await request.get({
                            url: `http://localhost:${appPort}/applications/${decoded.app_id}/public_key`,
                            json: true,
                            headers: {
                                'x-privacy-secret': await securityService.getServiceSecret()
                            }
                        });
                        publicKey = response.data.public_key;
                        await cache.set(`application:pubKey:${decoded.app_id}`, publicKey, 300);
                    }
                    decoded = jwt.verify(req.token, publicKey);
                    if (roles.length > 0 && roles.indexOf(decoded.role) === -1) {
                        return next(new AppError("Permission denied", ErrorType.permission_denied))
                    }
                    req.user = decoded;
                    return next();
                } catch (e) {
                    return next(new AppError(e.error ? e.error.message : e.message, ErrorType.unauthorized))
                }
            }
        }
    }
};
