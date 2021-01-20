const BaseDal = require("./base-dal");
const AppError = require("../helpers/appError");

class PartnerDal extends BaseDal{

    constructor(context) {
        super(context)
    }

    getModel(){
        return this.context.partnerModel;
    }
}

module.exports = PartnerDal;