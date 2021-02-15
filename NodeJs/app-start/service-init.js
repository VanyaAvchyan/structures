module.exports = require('../db/mysql/mysql-context').then(context => {
    const UserDal = require('../dal/users-dal');
    const PartnerDal = require('../dal/partner-dal');
    const ApplicationDal = require("../dal/application-dal");
    const RoleDal = require("../dal/role-dal");
    const UserRestoreKeyDal = require("../dal/user-restore-keys-dal");
    const SecurityDal = require("../dal/security-dal");

    //services import
    const UserService = require('../services/user-service');
    const FacebookService = require( '../services/facebook-service');
    const PartnerService = require('../services/partner-service');
    const TokenService = require('../services/token-service');
    const ApplicationService = require("../services/application-service");
    const RoleService = require("../services/roles-service");
    const SecurityService = require("../services/security-service");
    //dal
    const roleDal = new RoleDal(context);
    const usersDal = new UserDal(context);
    const partnerDal = new PartnerDal(context);
    const applicationDal = new ApplicationDal(context);
    const securityDal = new SecurityDal(context);
    const userRestoreKeyDal = new UserRestoreKeyDal(context);

    //services
    const securityService = new SecurityService(securityDal);
    const facebookService = new FacebookService();
    const roleService = new RoleService(roleDal);
    const partnerService = new PartnerService(partnerDal,applicationDal);
    const tokenService= new TokenService();
    const userService = new UserService(usersDal, applicationDal, userRestoreKeyDal,tokenService, roleService,
        securityService, facebookService);
    const applicationService = new ApplicationService(applicationDal);


    return  {
        facebookService: facebookService,
        partnerService: partnerService,
        userService: userService,
        applicationService:applicationService,
        roleService: roleService,
        securityService: securityService
    };
});
