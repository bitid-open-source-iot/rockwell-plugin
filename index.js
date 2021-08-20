const cors = require('cors');
const http = require('http');
const auth = require('./lib/auth');
const logger = require('./lib/logger');
const express = require('express');
const KGateway = require('./lib/kGateway');
const WebSocket = require('./lib/socket');
const RockwellMain = require('./lib/rockwellMain');
const ErrorResponse = require('./lib/error-response');
const ModbusMainController = require('./lib/modbusMainController');

require('dotenv').config();

global.__base = __dirname + '/';
global.__server = null;
global.__logger = logger;
global.__socket = null;
global.__deviceId = null;
global.__settings = require('./config.json');
global.__responder = require('./lib/responder');


__settings.mqttServerBitid.username = process.env.BITID_SERVER_MOSQUITTO_USERNAME
__settings.mqttServerBitid.password = process.env.BITID_SERVER_MOSQUITTO_PASSWORD

__settings.mqttRouters.username = process.env.BITID_LOCALROUTERS_MOSQUITTO_USERNAME
__settings.mqttRouters.password = process.env.BITID_LOCALROUTERS_MOSQUITTO_PASSWORD
// __settings.mqttRouters.host = 'mqtt://mosquitto' //For use in Kubernettes


__settings.mqttServerBitidLocal.username = process.env.BITID_LOCALROUTERS_MOSQUITTO_USERNAME
__settings.mqttServerBitidLocal.password = process.env.BITID_LOCALROUTERS_MOSQUITTO_PASSWORD

// __logger.info('SETTINGS**************************************************', __settings)

var portal = async () => {
    try {
        var app = express();

        app.use(cors());

        app.use(express.urlencoded({
            'limit': '50mb',
            'extended': true
        }));

        app.use(express.json({
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

        __logger.init();

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

        __logger.info('Server running')

        __server.on('close', () => {
            setTimeout(() => __server.listen(__settings.port), 1000);
        });

        __server.listen(__settings.port, () => __server.close());

        return true;
    } catch (error) {
        console.error(error);
        return false;
    };
};

async function start() {
    try {
        await portal()

        var kGateway = null;
        var rockwell = null;
        var modbusMainController = null;

        if (__settings.drivers.kGatewayEnabled == true) {
            __logger.info('Starting kGateway Driver')
            kGateway = new KGateway()
        }
        if (__settings.drivers.rockwellEnabled == true) {
            __logger.info('Starting rockwell Driver')
            rockwell = new RockwellMain();

            rockwell.on('data', inputs => {
                if (modbusMainController) {
                    inputs.map(input => {
                        __settings.sourceToDestinationModbusMapping.map(stdmm => {
                            if (stdmm.source.register == input.tagId) {
                                __logger.info(input.tagId, input.value);
                                modbusMainController.updateSource({
                                    value: input.value,
                                    deviceId: stdmm.source.deviceId,
                                    register: stdmm.source.register
                                })
                            };
                        });
                    });
                };
            });
        }
        if (__settings.drivers.modbusEnabled == true) {
            modbusMainController = new ModbusMainController({})

            // setTimeout(() => {
            //     let tmpVal = 819
            //     for (let i = 0; i < __settings.sourceToDestinationModbusMapping.length; i++) {
            //         const element = __settings.sourceToDestinationModbusMapping[i];
            //         modbusMainController.updateSource({
            //             deviceId: 1,
            //             register: element.source.register,
            //             value: tmpVal
            //         })
            //     }
            // }, 500)
        }
    } catch (e) {
        console.error(e)
    }
}

start()