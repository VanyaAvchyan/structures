const log4js = require('log4js');
const config = require("config");
const serviceName = config.get('service_name') || 'default';

const loggerConfig = {
    appenders: {
        stdout: {type: 'stdout'}
    },
    categories: {
        default : {
            appenders: ['stdout'],
            level: process.env.NODE_ENV === "production" ? 'info' : 'debug'
        }
    }
};
loggerConfig['categories'][serviceName] = {
    appenders: ['stdout'],
    level: process.env.NODE_ENV === "production" ? 'info' : 'debug'
};
log4js.configure(loggerConfig);

module.exports = log4js.getLogger(serviceName);
