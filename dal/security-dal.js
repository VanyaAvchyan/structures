const AppError = require("../helpers/appError");

class SecurityDal {

    constructor(context) {
       this.securityRedis = context.redisClients.security;
    }

    getServiceSecret(){
        return this.securityRedis.getAsync("service:secret");
    }

    async checkTokenBlackList(token){
       let blackListed = await this.securityRedis.sismemberAsync("token:blacklist", token);
       return blackListed === 1;
    }

}

module.exports = SecurityDal;