const AppError = require("../helpers/appError");
const {ErrorType} = require("../helpers/enums");
const {PartnerSchema, ApplicationSchema} = require("../validators/validator-factory");
const Promise = require("bluebird");
const crypto = Promise.promisifyAll(require("crypto"));
const shortId = require('shortid');
const { generateKeyPair } = require('crypto');


class PartnerService {


    constructor(partnerDal,applicationDal) {
        this.partnerDal = partnerDal;
        this.applicationDal = applicationDal;
    }


    /**
     * Creating new partner
     * @param {Object}partner
     * @returns {Promise<Object>}
     */
    async createPartner(partner) {
        let dbPartner = await this.partnerDal.findOne({name: partner.name});
        if(dbPartner){
            throw new AppError(`Partner with name ${partner.name} exists`, ErrorType.invalid_request)
        }
        return this.partnerDal.create(partner)
    }

    /**
     * Update Partner and return updated object
     * @param id
     * @param partner {Object}
     * @returns {Promise<Object>}
     */
    async updatePartnerByIdAndReturn(id, partner) {
        let updated = await this.partnerDal.updateById(id, partner, ['name', 'status']);
        if(!updated){
            throw new AppError("Update failed", ErrorType.invalid_request);
        }

        let updatedObj = await this.partnerDal.findById(id);
        return updatedObj;
    }

    /**
     * Set status to deleted
     * @param id partner id
     * @returns {Promise<boolean>}
     */
    async deletePartnerById(id){
        let deleted = await this.partnerDal.updateById(id, {status: "deleted"});
        if(!deleted){
            throw new AppError("Delete failed", ErrorType.invalid_request);
        }
        return deleted;
    }

    /**
     * Get partner by id
     * @param partnerId
     * @returns {Promise<*>}
     */
    async getPartnerById(partnerId){
        let partner = await this.partnerDal.findById(partnerId);
        if(!partner || partner.status === "deleted"){
            throw new AppError("Partner not found", ErrorType.not_found)
        }
        return partner;
    }

    /**
     * Get All partners
     *
     * @param {string} except_status
     * @returns {Promise<*>}
     */
    async getPartners(except_status) {
        let conditions = {};
        if(except_status)
            conditions = {status: {[this.partnerDal.operations.ne]: except_status}};
        return await this.partnerDal.find(conditions);
    }

    /**
     * Create partner application
     * @param application
     * @returns {Promise<application>}
     */
    async createApplication(application){
        let partnerExists =  await this.partnerDal.exists(application.partnerId);

        if(!partnerExists){
            throw new AppError("partner not found", ErrorType.invalid_request);
        }

        let secret =  await  crypto.randomBytesAsync(48);
        application.clientSecret = secret.toString("hex");
        let pair = await this._generateKeyPair();

        application.publicKey = pair.public;
        application.privateKey = pair.private;
        application.appId = shortId.generate();
        return this.applicationDal.create(application)
    }

    /**
     * Generate random public privet key pair
     * @returns {Promise}
     * @private
     */
    async _generateKeyPair(){
        return new Promise((resolve, reject) => {
            generateKeyPair('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                }
            }, (err, publicKey, privateKey) => {
                if(err){
                    return reject(err)
                }

                return resolve({
                    public: publicKey,
                    private: privateKey,
                })
            });
        })
    }
}

module.exports = PartnerService;