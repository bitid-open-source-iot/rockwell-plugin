const cors = require('cors');
const http = require('http');
const auth = require('./lib/auth');
const express = require('express');
const Rockwell = require('./lib/rockwell');
const WebSocket = require('./lib/socket');
const Telemetry = require('./lib/telemetry');
const bodyparser = require('body-parser');
const MqttSocket = require('./lib/mqtt');
const ErrorResponse = require('./lib/error-response');

global.__base = __dirname + '/';
global.__logger = require('./lib/logger')
global.__server = null;
global.__socket = null;
global.__deviceId = null;
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

                    args.req.body.deviceId = __deviceId;
                    auth.authenticate(args)
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

        __socket = new WebSocket(__server);

        __server.on('close', () => {
            setTimeout(() => __server.listen(__settings.port), 1000);
        });
          
        __server.listen(__settings.port, () => __server.close());

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

(async () => {
    try {
        await logger();
        await portal();
        
        const mqtt = new MqttSocket();
        const rockwell = new Rockwell();
        const telemetry = new Telemetry();

        mqtt.on('data', event => {
            __logger.info(event);
        });
        
        mqtt.on('control', event => {
            __logger.info(event);
        });

        mqtt.connect(__settings.server);

        rockwell.on('read', inputs => {
            __socket.send({
                'inputs': inputs,
                'barcode': rockwell.barcode(),
                'deviceId': telemetry.deviceId
            });
        });

        rockwell.on('data', data => {
            data = data.filter(o => typeof(o.value) != 'undefined' && o.value !== null && o.value !== '').map(o => {
                return {
                    'key': o.as,
                    'value': o.value,
                    'moduleId': o.moduleId
                };
            });
    
            const modules = data.reduce((group, input) => {
                if (group.hasOwnProperty(input.moduleId)) {
                    group[input.moduleId].push(input);
                } else {
                    group[input.moduleId] = [input];
                };
                return group;
            }, {});
    
            Object.keys(modules).map(async moduleId => {
                var status = {
                    'AI1': 0,
                    'AI2': 0,
                    'AI3': 0,
                    'AI4': 0,
                    'CI1': 0,
                    'CI2': 0,
                    'CI3': 0,
                    'CI4': 0,
                    'CI5': 0,
                    'CI6': 0,
                    'CI7': 0,
                    'CI8': 0,
                    'SIG': 0,
                    'BATT': 0,
                    'AIExt1': 0,
                    'AIExt2': 0,
                    'AIExt3': 0,
                    'AIExt4': 0,
                    'AIExt5': 0,
                    'AIExt6': 0,
                    'AIExt7': 0,
                    'AIExt8': 0,
                    'digitalsIn': 0
                };
    
                modules[moduleId].map(input => {
                    if (status.hasOwnProperty(input.key)) {
                        status[input.key] = input.value;
                    };
                });

                if (typeof(telemetry.deviceId) != 'undefined' && telemetry.deviceId !== null && telemetry.deviceId == '') {
                    mqtt.send(__settings.server.subscribe.data, {
                        'dataIn': status,
                        'rtuDate': new Date().getTime(),
                        'deviceId': telemetry.deviceId,
                        'moduleId': moduleId
                    });
                };
            });
        });

        rockwell.on('connect', () => {
            __logger.info('Rockwell PLC Connected');

            telemetry.connect(rockwell.barcode());

            rockwell.watch();
            
            setInterval(async () => rockwell.watch(), 5000);
            
            rockwell.read();
            
            setInterval(() => rockwell.read(), (__settings.txtime * 1000));
        });

        rockwell.on('disconnect', () => {
            __logger.warn('plc connection failure, reconnecting in a few seconds');
            setTimeout(() => {
                rockwell.connect(__settings.plc);
            }, 3000);
        });

        telemetry.on('active', event => {
            __deviceId = telemetry.deviceId;
        });

        telemetry.on('inactive', event => {
            __deviceId = null;
        });

        rockwell.connect(__settings.plc);

        __logger.info('Rockwell PLC Started');
    } catch (error) {
        console.log(error.message);
    };
}) ();