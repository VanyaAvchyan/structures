const BaseDal = require("./base-dal");
const AppError = require("../helpers/appError");

class UserRestoreKeyDal extends BaseDal{

    constructor(context) {
        super(context)
    }

    getModel(){
        return this.context.userRestoreKeyModel;
    }
}

module.exports = UserRestoreKeyDal;