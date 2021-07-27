const cors = require('cors');
const http = require('http');
const auth = require('./lib/auth');
const express = require('express');
const WebSocket = require('./lib/socket');
const bodyparser = require('body-parser');
const ErrorResponse = require('./lib/error-response');
const KGateway = require('./lib/kGateway');
const RockwellMain = require('./lib/rockwellMain');
const ModbusMainController = require('./lib/modbusMainController');
require('dotenv').config()

global.__base = __dirname + '/';
global.__server = null;
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

console.log('SETTINGS**************************************************', __settings)



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
        console.log('Loaded: ./api/config');

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

        console.log('Server running')

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


async function start(){
    try{
        await portal()
        if(__settings.drivers.kGatewayEnabled == true){
            console.log('Starting kGateway Driver')
            let kGateway = new KGateway()
        }
        if(__settings.drivers.rockwellEnabled == true){
            console.log('Starting rockwell Driver')
            let rockwell = new RockwellMain()
        }
        if(__settings.drivers.modbusEnabled == true){
            let modbusMainController = new ModbusMainController({})
            let tmpVal = 0
            setTimeout(()=>{
                setInterval(()=>{
                    modbusMainController.updateSource({
                        deviceId: 1,
                        register: 79,
                        value: tmpVal
                    })
                    tmpVal++
                    if(tmpVal > 255){
                        tmpVal = 0
                    }
    
                },1000)
    
            },5000)
        }


    }catch(e){
        console.error(e)
    }
}

start()
