const Q = require('q');
const log4js = require('log4js');
const ErrorResponse = require('./error-response');

exports.init = (settings) => {
    var deferred = Q.defer();

    try {
        log4js.configure(settings);
        deferred.reject();
    } catch (error) {
        var err = new ErrorResponse();
        err.error.errors[0].code = 503;
        err.error.errors[0].reason = error.message;
        err.error.errors[0].message = error.message;
        deferred.reject(err);
    };

    return deferred.promise;
};

exports.info = (message) => {
    if (typeof(message) == 'object' && message !== null) {
        message = JSON.stringify(message);
    };
    const logger = log4js.getLogger("rockwell");
    logger.level = 'info';
    logger.info(message);
};

exports.warn = (message) => {
    if (typeof(message) == 'object' && message !== null) {
        message = JSON.stringify(message);
    };
    const logger = log4js.getLogger("rockwell");
    logger.level = 'warn';
    logger.warn(message);
};

exports.debug = (message) => {
    if (typeof(message) == 'object' && message !== null) {
        message = JSON.stringify(message);
    };
    const logger = log4js.getLogger("rockwell");
    logger.level = 'debug';
    logger.debug(message);
};

exports.error = (message) => {
    if (typeof(message) == 'object' && message !== null) {
        message = JSON.stringify(message);
    };
    const logger = log4js.getLogger("rockwell");
    logger.level = 'error';
    logger.error(message);
};