const log4js = require('log4js');

exports.init = () => {
    log4js.configure(__settings.logger);
};

exports.info = (message) => {
    const logger = log4js.getLogger('rockwell-plugin');
    logger.level = 'info';
    logger.info(message);
};

exports.warn = (message) => {
    const logger = log4js.getLogger('rockwell-plugin');
    logger.level = 'warn';
    logger.warn(message);
};

exports.debug = (message) => {
    const logger = log4js.getLogger('rockwell-plugin');
    logger.level = 'debug';
    logger.debug(message);
};

exports.error = (message) => {
    const logger = log4js.getLogger('rockwell-plugin');
    logger.level = 'error';
    logger.error(message);
};