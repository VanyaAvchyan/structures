const BaseDal = require("./base-dal");
const AppError = require("../helpers/appError");

class RoleDal extends BaseDal{

    constructor(context) {
        super(context)
    }

    getModel(){
        return this.context.roleModel;
    }
}

module.exports = RoleDal;