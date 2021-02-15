const config = require('config');
const Promise = require('bluebird');
const request = require('request');
const AppError = require('../helpers/appError');
const {ErrorType} = require("../helpers/enums");

const graphApiUrls = {
    me: config.get("facebook").graph_api + "/me"
};

class FacebookService {

    constructor(){
    }

     me(token, fields) {
        let defaultFields = ["id", "email", "birthday", "first_name", "last_name", "gender", "locale", "timezone", "is_verified"];
        if(fields && fields.length){
            defaultFields = fields;
        }
        return new Promise((resolve, reject) => {
            let qs = {
                access_token: token,
                fields: defaultFields.join(",")
            };

            request.get(graphApiUrls.me, {json:true,qs:qs}, (err, response, body) => {
                if(err){
                    return reject(err);
                }
                if(body.error){
                    return reject(new AppError(body.error.message, ErrorType.invalid_request))
                }
                return resolve(body)
            })
        })
    }
}

module.exports = FacebookService;


