const Q = require('q');
const cors = require('cors');
const http = require('http');
const express = require('express');
const Rockwell = require('./lib/rockwell');
const WebSocket = require('./lib/socket');
const telemetry = require('./lib/telemetry');
const bodyparser = require('body-parser');
const ErrorResponse = require('./lib/error-response');

global.__base = __dirname + '/';
global.__logger = require('./lib/logger')
global.__server = null;
global.__socket = null;
global.__status = null;
global.__barcode = null;
global.__deviceId = null;
global.__rockwell = null;
global.__settings = require('./config.json');
global.__responder = require('./lib/responder');

var portal = () => {
    var deferred = Q.defer();

    try {
        var app = express();

        app.use(cors());

        app.use(bodyparser.urlencoded({
            'limit': '50mb',
            'extended': true
        }));

        app.use(bodyparser.json({
            'limit': '50mb'
        }));

        if (__settings.authentication) {
            app.use((req, res, next) => {
                if (req.method != 'GET' && req.method != 'PUT') {
                    var args = {
                        'req': req,
                        'res': res
                    };
                    telemetry.authenticate(args)
                        .then(result => {
                            next();
                        }, err => {
                            err.error.code = 401;
                            err.error.errors[0].code = 401;
                            __responder.error(req, res, err);
                        });
                } else {
                    next();
                };
            });
        };

        app.use('/', express.static(__dirname + '/app/dist/rockwell/'));
        app.get('/*', (req, res) => {
            res.sendFile(__dirname + '/app/dist/rockwell/index.html');
        });

        var config = require('./api/config');
        app.use('/api/config', config);
        __logger.info('Loaded: ./api/config');

        app.use((error, req, res, next) => {
            var err = new ErrorResponse();
            err.error.code = 500;
            err.error.message = 'Something broke';
            err.error.errors[0].code = 500;
            err.error.errors[0].reason = error.message;
            err.error.errors[0].message = error.message;
            __responder.error(req, res, err);
        });

        __server = http.createServer(app);

        __socket = new Socket(__server);

        __server.on('close', () => __server.listen(__settings.port));
          
        __server.listen(__settings.port, () => __server.close());

        deferred.resolve();
    } catch (error) {
        var err = ErrorResponse();
        err.error.errors[0].code = 503;
        err.error.errors[0].reason = error.message;
        err.error.errors[0].message = error.message;
        deferred.reject(err);
    };

    return deferred.promise;
};

var device = async () => {
    var deferred = Q.defer();

    try {
        await telemetry.deviceId()
            .then(res => {
                return true;
            }, err => {
                __logger.error(err);
                return false;
            });
    } catch (error) {
        __logger.error(error.message);
        return false;
    };

    return deferred.promise;
};

try {
    __logger.init()
    .then(portal, null)
    .then(device, null)
    .then(res => {
        __logger.info('Rockwell PLC Started');
    })
    .catch(err => {
        __logger.error(err);
    });
} catch (error) {
    console.log(error.message);
};