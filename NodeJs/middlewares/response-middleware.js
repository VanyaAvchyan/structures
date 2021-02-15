module.exports = (req, res, next) => {
    res.successResponse = function (body, message) {
        let r = {
            message : message || "OK",
            data : body,
            status: res.statusCode,
        };
        res.send(r);
    };
    next();
};