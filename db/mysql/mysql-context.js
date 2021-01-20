let Sequelize = require("sequelize");
const config = require("config");
const Promise = require("bluebird");
const redis = Promise.promisifyAll(require("redis"));
const mySqlConfig = config.get("mysql-config");
const redisConfig = config.get("redis-config");
const logger = require("../../helpers/logger");

const sequelize = new Sequelize(mySqlConfig.name, mySqlConfig.username, mySqlConfig.password, {
    host: mySqlConfig.host,
    dialect: 'mysql',
    logging:mySqlConfig.logging ? (m) => {logger.debug(m)} : false,
    timezone: config.get("timezone") || '+00:00',
});

const Partner = require("./models/partner")(sequelize,Sequelize.DataTypes);
const User = require("./models/user")(sequelize,Sequelize.DataTypes);
const Application = require("./models/application")(sequelize,Sequelize.DataTypes);
const UserInfo = require("./models/user_info")(sequelize,Sequelize.DataTypes);
const Roles = require("./models/roles")(sequelize, Sequelize.DataTypes);
const UserRestoreKey = require("./models/user-restore-keys")(sequelize, Sequelize.DataTypes);

User.hasOne(UserInfo, {foreignKey: "userId", as: "userInfo"});
User.belongsTo(Roles, {foreignKey: "roleId", as: "role"});
User.belongsTo(Partner, {foreignKey: "partnerId", as: "partner"});
User.belongsTo(Application, {foreignKey: "applicationId", as: "application"});
Application.belongsTo(Partner, {foreignKey: "partnerId", as: "partner"});

module.exports = sequelize.authenticate().then(()=> {
    return {
        userModel:User,
        partnerModel: Partner,
        applicationModel: Application,
        userInfoModel: UserInfo,
        roleModel: Roles,
        userRestoreKeyModel:UserRestoreKey,
        meta : {
            operations : Sequelize.Op,
            transaction : sequelize.transaction.bind(sequelize) // method for transactions
        },
        redisClients: {
            security: redis.createClient(redisConfig.security)
        }
    };
});