const AppError = require("../helpers/appError");
const {ErrorType} = require("../helpers/enums");

class RoleService {

    constructor(securityDal) {
        this.securityDal = securityDal;
    }

    /**
     * Get service secret key for internal communication
     * @returns {Promise<*>}
     */
    async getServiceSecret(){
        let secret = await this.securityDal.getServiceSecret();
        if(!secret){
            throw new AppError("Secret key not found", ErrorType.unknown_error);
        }
        return secret;
    }

    async checkTokenBlackList(token) {
       return this.securityDal.checkTokenBlackList(token);
    }

}

module.exports = RoleService;