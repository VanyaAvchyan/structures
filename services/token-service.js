const AppError = require("../helpers/appError");
const {ErrorType} = require("../helpers/enums");
const jwt = require('jsonwebtoken');
const Promise = require("bluebird");
const config = require("config");

const signAsync = Promise.promisify(jwt.sign,{context: jwt});

class TokenService {

    constructor() {
    }


    /**
     * Generate JWT token
     * @param user
     * @param application
     * @param optional
     * @returns {Promise<*|void>}
     */
    async create(user, application, optional={}) {
        const payload = {
            user_id: user.id,
            user_uuid: user.uuid,
            username: user.username,
            external_id: user.external_id,
            email: user.email,
            app_id: application.appId,
            partner_id: application.partnerId,
            frequency_program_level_id: user.frequencyProgramLevelId
        };
        Object.keys(optional).forEach(k=> {
            payload[k] = optional[k];
        });


        let lifeTime = (config.get("api-config") || {jwt_life_time: "10m"}).jwt_life_time;
        if(optional.remeberMe){
            lifeTime = "30d"
        }
        return signAsync(payload, application.privateKey, {algorithm: 'RS256', expiresIn: lifeTime});

    }
}

module.exports = TokenService;