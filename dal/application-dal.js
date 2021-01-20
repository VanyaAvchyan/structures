const BaseDal = require("./base-dal");
const AppError = require("../helpers/appError");

class ApplicationDal extends BaseDal{

    constructor(context) {
        super(context)
    }

    getModel(){
        return this.context.applicationModel;
    }
}

module.exports = ApplicationDal;