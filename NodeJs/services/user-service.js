const AppError = require("../helpers/appError");
const {ErrorType} = require("../helpers/enums");
const config = require("config");
const argon2 = require('argon2');
const uuidv4 = require('uuid/v4');
const request = require("request-promise");
const urlParse = require('url-parse');
const cryptoRandomString = require('crypto-random-string');


const randomInt = require("random-int");
const {UserConnectSchema} = require("../validators/validator-factory");

class UserService {

    /**
     *
     * @param {UserDal} userDal
     * @param {ApplicationDal} applicationDal
     * @param {UserRestoreKeyDal} userRestoreKeyDal
     * @param {TokenService} tokenService
     * @param {RoleService} roleService
     * @param {securityService} securityService
     * @param {facebookService} facebookService
     */
    constructor(userDal, applicationDal, userRestoreKeyDal, tokenService, roleService, securityService, facebookService) {
        this.userDal = userDal;
        this.tokenService = tokenService;
        this.applicationDal = applicationDal;
        this.mainAppName = config.get("main-app-name");
        this.roleService = roleService;
        this.serviceUrls = config.get("service-urls");
        this.appPort = config.get("api-config").port;
        this.securityService = securityService;
        this.facebookService = facebookService;
        this.userRestoreKeyDal = userRestoreKeyDal;
    }

    /**
     * Get all users
     *
     * @returns {Promise<Object>}
     */
    async getAllUsers() {
        let users = await this.userDal.find(
            {},
            0,
            100,
            ["role", "userInfo"]
        );
        users = users.map(o => o.excludeOnly(["password"]));
        return users;
    }

    /**
     * Get user by id
     *
     * @param {int} id
     * @returns {Promise<Object>}
     */
    async getById(id) {
        let user = await this.userDal.findById(id, ["role", "userInfo"]);
        if (!user) {
            throw new AppError("User not found", ErrorType.not_found);
        }
        return user.excludeOnly(["password"]);
    }

    /**
     * Create User
     *
     * @param {object} authUser
     * @param {object} userInfo
     * @returns {Promise<*>}
     */
    async createUser(authUser, userInfo) {
        let app = await this.applicationDal.findOne({name: this.mainAppName});

        if (!app) {
            throw new AppError("Unknown application", ErrorType.not_found);
        }

        let user = await this.userDal.getByUsernameOrEmail(userInfo.email);

        if (user) {
            throw new AppError("Email exists", ErrorType.invalid_request);
        }

        let role = await this.roleService.getRoleById(userInfo.role_id);

        if (!role) {
            throw new AppError("Role  not found", ErrorType.not_found);
        }

        // Check that the admin could not create a superAdmin
        let newUserRole = await this.roleService.getRoleById(userInfo.role_id);
        if (authUser.role == 'admin' && newUserRole.name == 'superAdmin') {
            throw new AppError("Admin can not create Super-Admin", ErrorType.permission_denied);
        }

        try {
            let response = await request.get({
                url: `http://localhost:${this.appPort}/partners/${userInfo.partner_id}`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                }
            });
            if (!response.data) {
                throw new AppError("Partner not found", ErrorType.invalid_request)
            }
        } catch (e) {
            throw e.error ? new AppError(e.error.message, ErrorType.invalid_request) : e
        }


        let password = await argon2.hash(userInfo.password);
        let newUser = {
            password: password,
            uuid: uuidv4(),
            email: userInfo.email,
            applicationId: app.id,
            partnerId: userInfo.partner_id,
            countryId: userInfo.countryId || 1,
            roleId: role.id,
        };

        user = await this.userDal.create(newUser);
        return user.excludeOnly(["password"]);
    }

    async signIn(userInfo) {
        return this._internalSignIn(userInfo)
    }

    async signUp(userInfo) {
        if (userInfo.password !== userInfo.confirm_password) {
            throw new AppError("Password confirmation failed", ErrorType.validation_error);
        }

        let app = await this.applicationDal.findOne({name: this.mainAppName});
        if (!app) {
            throw new AppError("Unknown application", ErrorType.not_found);
        }

        let user = await this.userDal.getByUsernameOrEmail(userInfo.email);

        if (user) {
            throw new AppError("Email exists", ErrorType.invalid_request);
        }

        let responseCountry = await request.get({
            url: `${this.serviceUrls.static_service}/countries/codes/${userInfo.country_code || 'my'}`,
            json: true,
            headers: {
                'x-privacy-secret': await this.securityService.getServiceSecret()
            }
        });

        if (!responseCountry.data) {
            throw new AppError("Country not found", ErrorType.invalid_request)
        }

        let response = await request.get({
            url: `${this.serviceUrls.segment_service}/white-labels/${userInfo.white_label_id}/program-level?event=signup`,
            json: true,
            headers: {
                'x-privacy-secret': await this.securityService.getServiceSecret()
            }
        });

        if (!response.data) {
            throw new AppError("Program level not found", ErrorType.invalid_request)
        }

        let role = await this.roleService.getRoleByName("member");

        let frequencyProgramLevelId = response.data.program_level_id;

        let password = await argon2.hash(userInfo.password);

        let newUser = {
            password: password,
            uuid: uuidv4(),
            email: userInfo.email,
            applicationId: app.id,
            partnerId: userInfo.partner_id || app.partnerId,
            countryId: responseCountry.data.id,
            roleId: role.id,
            frequencyProgramLevelId: frequencyProgramLevelId,
            isSubscribed: Boolean(userInfo.is_subscribed)
        };
        let transaction = await this.userDal.transaction();

        try {
            user = await this.userDal.create(newUser, transaction);
            let token = await this.tokenService.create(user, app, {
                role: role.name,
                rememberMe: Boolean(userInfo.remember_me)
            });

            if (userInfo.ref_id)
                await this._addUserReferral(userInfo.ref_id, user);
            await transaction.commit();
            return {
                access_token: token,
                token_life_time : config.get("api-config").jwt_life_time
            }
        } catch (e) {
            await transaction.rollback();
            throw e
        }
    }

    /**
     * Update User Info
     *
     * @param {int} userId
     * @param {object} userInfo
     * @returns {Promise<*>}
     */
    async updateUserInfo(userId, userInfo) {
        let transaction = await this.userDal.transaction();
        try {
            let user = {
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
                phone: (((userInfo.phone || "").match(/\d+/g)) || []).join(""),
                address: userInfo.address,
                address2: userInfo.address2,
                city: userInfo.city,
                zipCode: userInfo.zip_code,
                birthDate: userInfo.birth_date && new Date(userInfo.birth_date)
            };
            userInfo = await this.userDal.updateUserInfo(userId, user, transaction);
            transaction.commit();
            return userInfo;
        } catch (e) {
            transaction.rollback();
            throw e;
        }
    }

    /**
     *
     * @param {int} userId
     * @param {int} mangoesCount
     * @param {string} reason
     * @throws {AppError} AppError
     * @returns {Promise<void>}
     */
    async updateUserMangoes(userId, mangoesCount, reason) {
        let user = this.userDal.findById(userId);
        if (!user) {
            throw new AppError("User not found", ErrorType.not_found);
        }

        if (!user.mangoes) {
            user.mangoes = 0;
        }
        let newMangoesAmount = user.mangoes + mangoesCount;
        if (newMangoesAmount) {
            user.mangoes = newMangoesAmount;
        }

        let transaction = await this.userDal.transaction();
        try {
            await this.userDal.updateById(userId, user, ["mangoes"], transaction);

            let response = await request.post({
                url: `${this.serviceUrls.history_service}/histories/ledgers/mangoes`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                },
                form: {
                    user_id: userId,
                    amount: newMangoesAmount,
                    reason: reason
                }
            });

            if (!response.data) {
                throw new AppError("User referral not added", ErrorType.invalid_request)
            }
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    /**
     * @throws {AppError} AppError
     * @returns {Promise<void>}
     */
    async updateUserExpiredMangoes() {

        let transaction = await this.userDal.transaction();
        try {
            let response = await request.get({
                url: `${this.serviceUrls.history_service}/histories/ledgers/mangoes/expired`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                }
            });

            if (!response.data) {
                throw new AppError("User referral not added", ErrorType.invalid_request)
            }

            let tasks = response.data.map( async r => {
                let u = await this.userDal.findById(r.userId);
                u.mangoes -= r.total;
                return this.userDal.updateById(r.userId, u, ["mangoes"], transaction);
            });

            for(let t of tasks){
                await t;
            }
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    /**
     * Update User Password
     *
     * @param {int} userId
     * @param {object} data
     * @throws {AppError} AppError
     * @returns {Promise<*>}
     */
    async updateUserPassword(userId, data) {

        let user = await this.userDal.findById(userId);

        if(!data.noPass) {
            let validPassword = await argon2.verify(user.password, data.current_password);
            if (!validPassword) {
                throw new AppError("Current password is incorrect", ErrorType.not_found);
            }
        }
        if (data.new_password !== data.confirmed_password) {
            throw new AppError("New password not confirmed", ErrorType.not_found);
        }

        let new_pass = {
            password: await argon2.hash(data.new_password)
        };
        let updated = await this.userDal.updateById(userId, new_pass);
        if (!updated) {
            throw AppError("User password update failed", ErrorType.invalid_request)
        }
        return updated;
    }

    /**
     * Update user role
     *
     * @param {int} userId
     * @param {int} roleId
     * @throws {AppError} AppError
     * @returns {Boolean}
     */
    async updateUserRoleById(userId, roleId) {
        let user = await this.userDal.findById(userId);
        if (!user) {
            throw new AppError("User not found", ErrorType.not_found)
        }
        let role = await this.roleService.getRoleById(roleId);
        if (!role) {
            throw new AppError("Invalid role", ErrorType.not_found)
        }
        let updated = await this.userDal.updateById(userId, {roleId: role.id});
        if (!updated) {
            throw AppError("Update failed", ErrorType.invalid_request)
        }
        return updated;
    }

    /**
     * This is side case should think how to remove validation from here
     *
     * @param {object} userInfo
     * @param {object} applicationInfo
     * @throws {AppError} AppError
     * @returns {Promise<{access_token: *, is_guest: boolean}>}
     */
    async partnerSignIn(userInfo, applicationInfo) {
        if (userInfo) {
            const {error} = UserConnectSchema.validate(userInfo);
            if (error) {
                throw new AppError(error.message, ErrorType.validation_error);
            }
        }

        let app = await this._getApplication(applicationInfo.id, applicationInfo.secret);
        if (!app) {
            throw new AppError("Unknown application", ErrorType.unauthorized);
        }

        let user = {};
        if (userInfo) {
            user = await this.userDal.findOne({externalId: userInfo.user_id});

            if (!user) {
                let newUser = {
                    externalId: userInfo.user_id,
                    applicationId: app.id,
                    provider: "dummy"
                };
                user = await this.userDal.create(newUser);
            }
        }

        let token = await this.tokenService.create(user, app);
        return {
            access_token: token,
            is_guest: !Boolean(userInfo),
            token_life_time : config.get("api-config").jwt_life_time
        }
    }

    logoutUser(token) {
        return this.userDal.addTokenToBlacklist(token);
    }

    async fbSignIn(userInfo) {
        let fbProfile = await this.facebookService.me(userInfo.fb_token);
        if (!fbProfile) {
            throw new AppError("Invalid fb token", ErrorType.invalid_request);
        }
        let app = await this.applicationDal.findOne({name: this.mainAppName});
        if (!app) {
            throw  new AppError("Unknown application", ErrorType.not_found);
        }

        let user = await this.userDal.getByUsernameOrEmail(fbProfile.email);

        if (!user) {
            let role = await this.roleService.getRoleByName("member");
            let transaction = await this.userDal.transaction();

            try {
                let response = await request.get({
                    url: `${this.serviceUrls.segment_service}/white-labels/${userInfo.white_label_id}/program-level?event=signup`,
                    json: true,
                    headers: {
                        'x-privacy-secret': await this.securityService.getServiceSecret()
                    }
                });

                if (!response.data) {
                    throw new AppError("Program level not found", ErrorType.invalid_request)
                }
                let newUser = {
                    uuid: uuidv4(),
                    email: fbProfile.email,
                    applicationId: app.id,
                    partnerId: userInfo.partner_id || app.partnerId,
                    countryId: userInfo.country_id || 1,
                    roleId: role.id,
                    frequencyProgramLevelId: response.data.program_level_id,
                    provider: "facebook",
                    externalId: fbProfile.id,
                    isSubscribed: Boolean(userInfo.is_subscribed)
                };
                user = await this.userDal.create(newUser, [], transaction);

                let userDetails = {
                    firstName: fbProfile.first_name,
                    lastName: fbProfile.last_name,
                    birthDate: fbProfile.birthday && new Date(fbProfile.birthday)
                };
                await this.userDal.updateUserInfo(user.id, userDetails, transaction);
                transaction.commit();
            } catch (e) {
                await transaction.rollback();
                throw e;
            }
        }
        let token = await this.tokenService.create(user, app, {role: 'member', rememberMe: false});
        return {
            access_token: token,
            token_life_time : config.get("api-config").jwt_life_time
        }
    }

    async sendInvitation(data, user) {
        let url = urlParse(data.referral_link, true);
        if (url.query.ref_id !== user.user_uuid) {
            throw new AppError("invalid invitation link", ErrorType.invalid_request);
        }

        // todo send invitation with notification service
        try {
            let response = await request.post({
                url: `${this.serviceUrls.notification_service}/notifications/referrals`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                },
                form: {
                    referrer: user.email,
                    to: data.email,
                    referral_link: data.referral_link
                }
            });

            if (!response.data) {
                throw new AppError("User referral not sent", ErrorType.invalid_request)
            }

            response = await request.post({
                url: `${this.serviceUrls.history_service}/histories/users/referrers`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                },
                form: {
                    user_id: user.user_id,
                    referrer_email: data.email
                }
            });

            if (!response.data) {
                throw new AppError("User referral not added", ErrorType.invalid_request)
            }
        } catch (e) {
            throw e.Error ? new AppError(e.Error.message, ErrorType.invalid_request) : e
        }
    }

    async getUserReferrals(userId) {
        try {

            let response = await request.get({
                url: `${this.serviceUrls.history_service}/histories/users/referrers?user_id=${userId}`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                },
            });

            if (!response.data) {
                throw new AppError("User referral not added", ErrorType.invalid_request)
            }
            return response.data
        } catch (e) {
            throw e.Error ? new AppError(e.Error.message, ErrorType.invalid_request) : e
        }
    }

    async createUserRestoreKey(email) {
        let restoreKey = await this.userRestoreKeyDal.findOne({email});
        if (!restoreKey) {
            let key = cryptoRandomString({length: 6, characters: '1234567890'});
            let exists = await this.userRestoreKeyDal.findOne({key: key})
            while (exists) {
                key = cryptoRandomString({length: 6, characters: '1234567890'});
                exists = await this.userRestoreKeyDal.findOne({key: key})
            }
            restoreKey = await this.userRestoreKeyDal.create({email,key})
        }

        try {
            let response = await request.post({
                url: `${this.serviceUrls.notification_service}/notifications/restores`,
                json: true,
                headers: {
                    'x-privacy-secret': await this.securityService.getServiceSecret()
                },
                body: {
                    email: email,
                    key: restoreKey.key.toString()
                }
            });

            if (!response.data) {
                throw new AppError("User referral not sent", ErrorType.invalid_request)
            }
        } catch (e) {
            throw e.Error ? new AppError(e.Error.message, ErrorType.invalid_request) : e
        }
    }

    async restoreUser(key){
        let restoreKey = await this.userRestoreKeyDal.findOne({key});
        if(!restoreKey){
            throw new AppError("Invalid key for restore", ErrorType.invalid_request)
        }
        let token = await this._internalSignIn({email: restoreKey.email},true);
        let deleted = await this.userRestoreKeyDal.deleteById(restoreKey.id);
        if(!deleted){
            throw new AppError("Unable to restore user", ErrorType.invalid_request)
        }
        return token;
    }

    /*
    private methods
     */
    async _fbSignIn(userInfo) {
        let fbProfile = this.facebookService.me(userInfo.fb_token);
        if (!fbProfile) {
            throw new AppError("Invalid token", ErrorType.invalid_request);
        }
        let user = await this.userDal.getByFBId(fbProfile.id);
        if (!user) {
            let username = this._generateUsername(fbProfile.first_name + "_" + fbProfile.last_name);
            let newUser = {
                first_name: fbProfile.first_name,
                last_name: fbProfile.last_name,
                username: username,
                avatar: fbProfile.link,
                confirmed: true,
                facebook: {
                    email: fbProfile.email,
                    id: fbProfile.id
                }
            };
            user = await this.userDal.create(newUser)
        }

        let authToken = await this.authTokenService.getOrCreateToken(user.id);
        return {
            user: user,
            token: authToken.token
        }
    }

    async _addUserReferral(uuid, referrerUser) {
        let user = await this.userDal.findOne({uuid: uuid});
        if (!user) {
            throw new AppError("Referral user not found");
        }

        let response = await request.post({
            url: `${this.serviceUrls.history_service}/histories/users/referrers`,
            json: true,
            headers: {
                'x-privacy-secret': await this.securityService.getServiceSecret()
            },
            form: {
                user_id: user.id,
                referrer_id: referrerUser.id,
                referrer_email: referrerUser.email
            }
        });

        if (!response.data) {
            throw new AppError("User referral not added", ErrorType.invalid_request)
        }
    }

    async _internalSignIn(userInfo, noPass = false) {
        let app = await this.applicationDal.findOne({name: this.mainAppName});
        if (!app) {
            throw  new AppError("Unknown application", ErrorType.not_found);
        }

        let user = await this.userDal.getByUsernameOrEmail(userInfo.email);

        if (!user) {
            throw new AppError("Email or password is incorrect", ErrorType.unauthorized);
        }
        if (!noPass) {
            let validPassword = await argon2.verify(user.password, userInfo.password);

            if (!validPassword) {
                throw new AppError("Username or password is incorrect", ErrorType.not_found);
            }
        }

        let role = await this.roleService.getRoleById(user.roleId);
        let token = await this.tokenService.create(user, app, {
            role: role.name,
            rememberMe: Boolean(userInfo.remember_me),
            noPass: noPass
        });
        return {
            access_token: token,
            token_life_time : config.get("api-config").jwt_life_time
        }
    }

    async _getApplication(app_id, app_secret) {
        return this.applicationDal.findOne({appId: app_id, secret: app_secret})
    }

    async _generateUsername(username) {
        let user = await this.userDal.getByUsernameOrEmail(username);
        if (user) {
            return this._generateUsername(username + randomInt(0, 10))
        }
        return username;
    }


}

module.exports = UserService;