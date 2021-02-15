const BaseDal = require("./base-dal");
const AppError = require("../helpers/appError");

class UserDal extends BaseDal {

    constructor(context) {
        super(context);
        this.securityRedis = context.redisClients.security;
    }

    /***
     * Get user by email or user name
     * @param value
     * @param transaction
     * @returns {Promise<*>}
     */
    getByUsernameOrEmail(value, transaction=null) {
        if (value.indexOf("@") > -1) {
            return this.findOne({email: value}, [], transaction)
        }
        return this.findOne({username: value}, [], transaction)
    }

    getUserByFbId(fbId){
        return this.findOne({externalId: fbId, provider:"facebook"})
    }

    /**
     * Update or create user info
     * @param id
     * @param userInfo
     * @param transaction
     * @returns {Promise<<Model<any, any> | null>|undefined|*|<Model<any, any>>>}
     */
    async updateUserInfo(id, userInfo, transaction = null) {
        let fields = Object.keys(userInfo).filter((key) => Boolean(userInfo[key]));
        let user = await this.context.userInfoModel.findOne({where: {userId: id}}, transaction);
        if (!user) {
            userInfo.userId = id;

            let info = await this.context.userInfoModel.create(userInfo, {
                fields: fields.length ? fields.concat("userId") : null,
                transaction: transaction
            })
            return info.toJSON();
        }

        await this.context.userInfoModel.update(userInfo,
            {
                where: {
                    userId: id,
                },
                fields: fields.length ? fields : null,
                raw: true,
                transaction:transaction
            });

        return this.context.userInfoModel.findOne({where: {userId: id} ,transaction});
    }

    async addTokenToBlacklist(token){
        let setExists = await this.securityRedis.existsAsync("token:blacklist");
        if(!setExists){
            let result = await this.securityRedis.saddAsync("token:blacklist", token);
            await this.securityRedis.expireAsync("token:blacklist", 30*24*60*60);
            return result === 1;
        }
        let result = await this.securityRedis.saddAsync("token:blacklist", token);
        return result === 1;
    }

    getModel() {
        return this.context.userModel;
    }
}

module.exports = UserDal;