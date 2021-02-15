const AppError = require("../helpers/appError");
const {ErrorType} = require("../helpers/enums");


class ApplicationService {

    constructor(applicationDal) {
        this.applicationDal = applicationDal;
    }

    /**
     * Get public key for application
     * @param appId
     * @returns {{public_key: *}}
     * @throws AppError if application not found
     */
    async getPublicKey(appId) {
        let app = await this.applicationDal.findOne({appId: appId});
        if(!app) {
            throw new AppError("Invalid application", ErrorType.invalid_request);
        }

        return {
            public_key :app.publicKey
        };

    }

    /**
     * Get application by id
     * @param id
     * @returns {Promise<void>}
     */
    async getApplicationById(id){
        let app = await this.applicationDal.findOne({appId:id});
        if(!app) {
            throw new AppError("Invalid application", ErrorType.invalid_request);
        }

        return app.excludeOnly(["privateKey"]);
    }

    /**
     * get all applications
     * @returns {Promise<void>}
     */
    async getApplications(){
        let apps = await this.applicationDal.find();

        return apps.excludeOnly(["privateKey"]);
    }
}

module.exports = ApplicationService;