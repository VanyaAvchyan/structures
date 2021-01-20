const {ErrorType} = require('../helpers/enums');
const AppError = require('../helpers/appError');
const logger = require('../helpers/logger');

function generateErrorResponse(err, status, res) {
    let errObj = {message: err.message, status:status};
    errObj.data = err.optionalInfo || [];
    return res.status(status).send(errObj)

}
function generateAndSendAppErrorResponce(err, res) {
    switch (err.reason){
        case ErrorType.invalid_request:
            return generateErrorResponse(err, 400, res);
        case ErrorType.not_found:
            return generateErrorResponse(err, 404, res);
        case ErrorType.permission_denied:
            return generateErrorResponse(err, 403, res);
        case ErrorType.unauthorized:
            return generateErrorResponse(err, 401, res);
        case ErrorType.validation_error:
            return generateErrorResponse(err, 400, res);
        case ErrorType.unknown_error:
        default:
            logger.error(err.stack);
            return generateErrorResponse(err, 500, res);
    }
}

module.exports = function (err, req, res, next) {
    return generateAndSendAppErrorResponce(err, res);
};