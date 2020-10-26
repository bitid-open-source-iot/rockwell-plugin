const cors = require('cors');
const http = require('http');
const express = require('express');
const Rockwell = require('./lib/rockwell');
const telemetry = require('./lib/telemetry');
const bodyparser = require('body-parser');
const ErrorResponse = require('./lib/error-response');
const WebSocketClient = require('websocket').client;
const WebSocketServer = require('websocket').server;

global.__base = __dirname + '/';
global.__logger = require('./lib/logger')
global.__server = null;
global.__status = null;
global.__socket = null;
global.__rockwell = null;
global.__settings = require('./config.json');
global.__responder = require('./lib/responder');

var portal = async () => {
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
        __server.listen(__settings.port);

        if (!__settings.production) {
            const wsserver = new WebSocketServer({
                'httpServer': __server
            });

            wsserver.on('request', (request) => {
                var connection = request.accept(null, request.origin);
                setTimeout(() => {
                    connection.send('Test Message');
                }, 3000);
            });
        };

        return true;
    } catch (error) {
        __logger.error(error.message);
        return false;
    };
};

var logger = async () => {
    try {
        __logger.init(__settings.logger);
        return true;
    } catch (error) {
        return false;
    };
};

var socket = async () => {
    try {
        const client = new WebSocketClient();

        client.on('connectFailed', (error) => {
            __logger.error(error.toString());
        });
         
        client.on('connect', (connection) => {
            __socket = connection;

            __socket.on('error', async (error) => {
                __logger.error(error.toString());
            });

            __socket.on('close', async () => {
                __logger.warn('Socket closed, reconnection in 5 seconds!');
                setTimeout(() => client.connect(__settings.thingapp), 5000)
            });

            __socket.on('message', async (message) => {
                __logger.info('Socket Data: ' + message.utf8Data);
            });
        });

        client.connect(__settings.thingapp);
        return true;
    } catch (error) {
        __logger.error(error.message);
        return false;
    };
};

var device = async () => {
    try {
        telemetry.deviceId()
            .then(res => {

            }, err => {

            });
        return true;
    } catch (error) {
        __logger.error(error.message);
        return false;
    };
};

var controller = async () => {
    try {
        __plc = new PLC();
        return true;
    } catch (error) {
        return false;
    };
};

(async () => {
    await logger();
    await portal();
    await socket();
    await device();
    await controller();
    __rockwell = new Rockwell()
    __rockwell.connect();
    __logger.info('Rockwell PLC Started');
}) ();