const log4js = require('log4js');

exports.init = (settings) => {
    log4js.configure(settings);
};

exports.info = (message) => {
    const logger = log4js.getLogger("rockwell");
    logger.level = 'info';
    logger.info(message);
};

exports.warn = (message) => {
    const logger = log4js.getLogger("rockwell");
    logger.level = 'warn';
    logger.warn(message);
};

exports.debug = (message) => {
    const logger = log4js.getLogger("rockwell");
    logger.level = 'debug';
    logger.debug(message);
};

exports.error = (message) => {
    const logger = log4js.getLogger("rockwell");
    logger.level = 'error';
    logger.error(message);
};