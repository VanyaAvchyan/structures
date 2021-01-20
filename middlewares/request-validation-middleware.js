const {ErrorType} = require('../helpers/enums');
const AppError = require('../helpers/appError');
const config = require('config');

module.exports = function () {
    return {
        bodyValidator: (schema) => {
            return (req, res, next) => {
                const {error} = schema.validate(req.body);
                if (error){
                    let details = (error.details || []).map(o => {return {message :o.message}}).filter(Boolean);

                    return next(new AppError("Validation failed ", ErrorType.validation_error, details.length ? details : null ));
                }

                next()
            }
        }
    }
};
