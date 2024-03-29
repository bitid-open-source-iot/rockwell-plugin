const chai = require('chai');
const subset = require('chai-subset');

chai.use(subset);

const Q = require('q');
const MQTT = require('mqtt');
const fetch = require('node-fetch');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();
const config = require('./config.json');
const WebSocketClient = require('websocket').client;
const { response } = require('express');
require('dotenv').config()

var mqtt = null;
var socket = new WebSocketClient();
var connection = null;


config.mqttRockwell.username = process.env.BITID_LOCALROUTERS_MOSQUITTO_USERNAME
config.mqttRockwell.password = process.env.BITID_LOCALROUTERS_MOSQUITTO_PASSWORD

config.mqttServerBitid.username = process.env.BITID_LOCALROUTERS_MOSQUITTO_USERNAME
config.mqttServerBitid.password = process.env.BITID_LOCALROUTERS_MOSQUITTO_PASSWORD

config.mqttKGateway.username = process.env.BITID_LOCALROUTERS_MOSQUITTO_USERNAME
config.mqttKGateway.password = process.env.BITID_LOCALROUTERS_MOSQUITTO_PASSWORD


describe('rockwell', function () {
    describe('Connect', function () {
        it('Web Socket', function (done) {
            this.timeout(5000);

            socket.on('connect', event => {
                connection = event;
                done();
            });

            socket.connect(config.websocket);
        });

        it('MQTT Socket', function (done) {
            this.timeout(5000);

            mqtt = MQTT.connect([config.mqttRockwell.socket, ':', config.mqttRockwell.port].join(''), {
                'host': config.mqttRockwell.socket,
                'port': config.mqttRockwell.port,
                'username': config.mqttServerBitid.username,
                'password': config.mqttServerBitid.password
            });

            mqtt.on('connect', () => {
                done();
            });
        });
    });

    describe('Subscribe', function () {
        it('Data Topic', function (done) {
            this.timeout(5000);

            mqtt.subscribe(config.mqttRockwell.subscribe.data, (error) => {
                if (error) {
                    done(error.message);
                } else {
                    done();
                };
            });
        });

        it('Control Topic', function (done) {
            this.timeout(5000);

            mqtt.subscribe(config.mqttRockwell.subscribe.control, (error) => {
                if (error) {
                    done(error.message);
                } else {
                    done();
                };
            });
        });
    });

    describe('Config', function () {
        it('/api/config/get', function (done) {
            this.timeout(5000);

            tools.api.config.get()
                .then((result) => {
                    try {
                        result.should.have.property('io');
                        result.should.have.property('plc');
                        result.should.have.property('txtime');
                        result.should.have.property('server');
                        result.should.have.property('timeout');
                        result.should.have.property('production');
                        done();
                    } catch (e) {
                        done(e);
                    };
                }, (err) => {
                    try {
                        done(err);
                    } catch (e) {
                        done(e);
                    };
                });
        });

        it('/api/config/update', function (done) {
            this.timeout(5000);

            tools.api.config.update()
                .then((result) => {
                    try {
                        result.should.have.property('updated');
                        expect(result.updated).to.equal(1);
                        done();
                    } catch (e) {
                        done(e);
                    };
                }, (err) => {
                    try {
                        done(err);
                    } catch (e) {
                        done(e);
                    };
                });
        });
    });

    describe('Send & Recieve Data', function () {
        it(config.mqttRockwell.subscribe.data, function (done) {
            this.timeout(5000);

            mqtt.on('message', (topic, message) => {
                if (topic == config.mqttRockwell.subscribe.data) {
                    var result = JSON.parse(message.toString())
                    result.should.have.property('rtuId');
                    result.should.have.property('dataIn');
                    result.should.have.property('rtuDate');
                    result.should.have.property('moduleId');
                    done();
                };
            });

            mqtt.publish(config.mqttRockwell.subscribe.data, JSON.stringify({
                'dataIn': {
                    'IP': '0.0.0.0',
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
                },
                'rtuId': '000000000000000000000182', // config.deviceId,
                'rtuDate': new Date().getTime(),
                'moduleId': 0
            }));
        });

        it(config.mqttRockwell.subscribe.control, function (done) {
            this.timeout(5000);

            mqtt.on('message', (topic, message) => {
                if (topic == config.mqttRockwell.subscribe.control) {
                    var result = JSON.parse(message.toString())
                    result.should.have.property('rtuId');
                    result.should.have.property('dataIn');
                    result.should.have.property('rtuDate');
                    result.should.have.property('moduleId');
                    done();
                };
            });

            mqtt.publish(config.mqttRockwell.subscribe.control, JSON.stringify({
                'dataIn': {
                    'IP': '0.0.0.0',
                    'AI1': Math.floor(Math.random() * 100) + 1,
                    'AI2': Math.floor(Math.random() * 100) + 1,
                    'AI3': Math.floor(Math.random() * 100) + 1,
                    'AI4': Math.floor(Math.random() * 100) + 1,
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
                },
                'rtuId': '000000000000000000000182', // config.deviceId,
                'rtuDate': new Date().getTime(),
                'moduleId': 0
            }));
        });
    });

    describe('Clean Up Sockets', function () {
        it('Close Web Socket', function (done) {
            this.timeout(5000);
            connection.close();
            done();
        });

        it('Close MQTT Socket', function (done) {
            this.timeout(5000);
            mqtt.end();
            done();
        });
    });

    /*
    ====================================
    1 - Connect To Web Socket       | ✓ |
    2 - Connect To MQTT Socket      | ✓ |
    3 - Subscribe To Data Topic     | ✓ |
    4 - Subscribe To Control Topic  | ✓ |
    5 - Get Config                  | ✓ |
    6 - Update Config               | ✓ |
    7 - Send MQTT Data              | ✓ |
    8 - Recieve MQTT Data           | ✓ |
    9 - Close Web Socket            | ✓ |
    9 - Close MQTT Socket           | ✓ |
    ====================================
    */
})


// describe.only('kGateway', function () {
//     global.__settings = require('../config.json');
//     let KGATEWAY = require('../lib/kGateway')
//     let kGateway
//     it('Run kGateway', function (done) {
//         kGateway = new KGATEWAY({ "tagFixedTxTime": 1 })
//         kGateway.clearTags({})
//         done()
//     })

//     it('process first tag', async function () {
//         let topic = "kbeacon/publish/68B9D3DFE78C"
//         let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
//         let response = { topic, message }
//         response = await kGateway.processData(response)
//         response = await kGateway.listTags(response)

//         response.arrTags[0].txCount.should.equal(1)
//         response.arrTags.length.should.equal(1)
//     })


//     it('process first tag again', async function () {
//         let topic = "kbeacon/publish/68B9D3DFE78C"
//         let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
//         let response = { topic, message }
//         response = await kGateway.processData(response)
//         response = await kGateway.listTags(response)

//         response.arrTags[0].txCount.should.equal(1)
//         response.arrTags.length.should.equal(1)
//     })

//     it('process second tag', async function () {
//         let topic = "kbeacon/publish/68B9D3DFE78C"
//         let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "FFFFFFFFFFFF", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "FFFFFFFFFFFF", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
//         let response = { topic, message }
//         response = await kGateway.processData(response)
//         response = await kGateway.listTags(response)

//         response.arrTags[1].txCount.should.equal(1)
//         response.arrTags.length.should.equal(2)
//     })


//     it('process router alive message', async function () {
//         let topic = "kbeacon/publish/68B9D3DFE78C"
//         let message = JSON.stringify({"msg":"alive","gmac":"68B9D3DFE78C","ver":"KBGW_V3.5.3","subaction":"kbeacon/subaction/68B9D3DFE78C","pubaction":"kbeacon/pubaction/68B9D3DFE78C","downDevices":0,"blever":"v24.3","hver":"514","temp":22,"advDevices":1})
//         let response = { topic, message }
//         response = await kGateway.processData(response)
//         response = await kGateway.listTags(response)

//         response.arrTags[1].txCount.should.equal(1)
//         response.arrTags.length.should.equal(3)
//     })

//     //message:

//     it('wait just over 1 minute and check fixed Tx been done for second tags', async function () {
//         this.timeout(70000)
//         function wait() {
//             let deferred = Q.defer()
//             setTimeout(async () => {
//                 let topic = "kbeacon/publish/68B9D3DFE78C"
//                 let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "FFFFFFFFFFFF", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "FFFFFFFFFFFF", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
//                 let response = { topic, message }
//                 response = await kGateway.processData(response)
//                 deferred.resolve()
//             }, 65000);
//             return deferred.promise
//         }

//         console.log('wait just over 1 minute and check fixed Tx been done for both tags')
//         await wait()
//         let response = {}
//         response = await kGateway.listTags(response)
//         response.arrTags[0].txCount.should.equal(1)
//         response.arrTags[1].txCount.should.equal(2)
//         response.arrTags.length.should.equal(3)

//     })

//     // describe('Connect', function () {

//     //     it('MQTT Socket', function (done) {
//     //         this.timeout(5000);

//     //         mqtt = MQTT.connect([config.mqttKGateway.socket, ':', config.mqttKGateway.port].join(''), {
//     //             'host': config.mqttKGateway.socket,
//     //             'port': config.mqttKGateway.port,
//     //             'username': config.mqttKGateway.username,
//     //             'password': config.mqttKGateway.password
//     //         });

//     //         mqtt.on('connect', () => {
//     //             let message = JSON.stringify({"msg":"advData","gmac":"68B9D3DFE78C","obj":[{"type":2,"dmac":"DD3304130897","refPwr":-14,"nid":"6B6B6D636E2E636F6D01","sid":"000000000001","rssi":-60,"time":"2021-05-20 18:12:48"},{"type":16,"dmac":"DD3304130897","refPwr":-14,"url":"00696F742D6770732E636F2E7A61","rssi":-64,"time":"2021-05-20 18:12:49"}]})
//     //             mqtt.publish('kbeacon/publish/68B9D3DFE78C', message)
//     //             done();
//     //         });
//     //     });

//     // })

//     // describe('Check', function () {

//     // })




// })

var tools = {
    api: {
        config: {
            get: async () => {
                var deferred = Q.defer();

                const response = await tools.post('/api/config/get', {
                    'filter': [
                        'io',
                        'plc',
                        'txtime',
                        'server',
                        'timeout',
                        'production'
                    ]
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            update: async () => {
                var deferred = Q.defer();

                const response = await tools.post('/api/config/update', {
                    'io': [
                        {
                            "in": {
                                "key": "AI1",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AI1",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[0]",
                            "inputId": "000000000000000000000001",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI1"
                        },
                        {
                            "in": {
                                "key": "AI2",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AI2",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[1]",
                            "inputId": "000000000000000000000002",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI2"
                        },
                        {
                            "in": {
                                "key": "AI3",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AI3",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[2]",
                            "inputId": "000000000000000000000003",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI3"
                        },
                        {
                            "in": {
                                "key": "AI4",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AI4",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[3]",
                            "inputId": "000000000000000000000004",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI4"
                        },
                        {
                            "in": {
                                "key": "CI1",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI1",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[4]",
                            "inputId": "000000000000000000000005",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI1"
                        },
                        {
                            "in": {
                                "key": "CI2",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI2",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[5]",
                            "inputId": "000000000000000000000006",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI2"
                        },
                        {
                            "in": {
                                "key": "CI3",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI3",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[6]",
                            "inputId": "000000000000000000000007",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI3"
                        },
                        {
                            "in": {
                                "key": "CI4",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI4",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[7]",
                            "inputId": "000000000000000000000008",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI4"
                        },
                        {
                            "in": {
                                "key": "CI5",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI5",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[8]",
                            "inputId": "000000000000000000000009",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI5"
                        },
                        {
                            "in": {
                                "key": "CI6",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI6",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[9]",
                            "inputId": "000000000000000000000010",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI6"
                        },
                        {
                            "in": {
                                "key": "CI7",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI7",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[10]",
                            "inputId": "000000000000000000000011",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI7"
                        },
                        {
                            "in": {
                                "key": "CI8",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "CI8",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[11]",
                            "inputId": "000000000000000000000012",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI8"
                        },
                        {
                            "in": {
                                "key": "SIG",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "SIG",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[12]",
                            "inputId": "000000000000000000000013",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "SIG"
                        },
                        {
                            "in": {
                                "key": "BATT",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "BATT",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[13]",
                            "inputId": "000000000000000000000014",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "BATT"
                        },
                        {
                            "in": {
                                "key": "AIExt1",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AIExt1",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[14]",
                            "inputId": "000000000000000000000015",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt1"
                        },
                        {
                            "in": {
                                "key": "AIExt2",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AIExt2",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[15]",
                            "inputId": "000000000000000000000016",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt2"
                        },
                        {
                            "in": {
                                "key": "AIExt3",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AIExt3",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[16]",
                            "inputId": "000000000000000000000017",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt3"
                        },
                        {
                            "in": {
                                "key": "AIExt4",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AIExt4",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[17]",
                            "inputId": "000000000000000000000018",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt4"
                        },
                        {
                            "in": {
                                "key": "AIExt5",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AIExt5",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[18]",
                            "inputId": "000000000000000000000019",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt5"
                        },
                        {
                            "in": {
                                "key": "AIExt6",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "AIExt6",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[19]",
                            "inputId": "000000000000000000000020",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt6"
                        },
                        {
                            "in": {
                                "key": "digitalsIn",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000182"
                            },
                            "out": {
                                "key": "digitalsIn",
                                "moduleId": 0
                            },
                            "tagId": "ROSE_091_Rx01[20]",
                            "inputId": "000000000000000000000021",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "digitalsIn"
                        },
                        {
                            "in": {
                                "key": "AI1",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AI1",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[0]",
                            "inputId": "000000000000000000000022",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI1"
                        },
                        {
                            "in": {
                                "key": "AI2",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AI2",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[1]",
                            "inputId": "000000000000000000000023",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI2"
                        },
                        {
                            "in": {
                                "key": "AI3",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AI3",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[2]",
                            "inputId": "000000000000000000000024",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI3"
                        },
                        {
                            "in": {
                                "key": "AI4",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AI4",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[3]",
                            "inputId": "000000000000000000000025",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AI4"
                        },
                        {
                            "in": {
                                "key": "CI1",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI1",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[4]",
                            "inputId": "000000000000000000000026",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI1"
                        },
                        {
                            "in": {
                                "key": "CI2",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI2",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[5]",
                            "inputId": "000000000000000000000027",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI2"
                        },
                        {
                            "in": {
                                "key": "CI3",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI3",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[6]",
                            "inputId": "000000000000000000000028",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI3"
                        },
                        {
                            "in": {
                                "key": "CI4",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI4",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[7]",
                            "inputId": "000000000000000000000029",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI4"
                        },
                        {
                            "in": {
                                "key": "CI5",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI5",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[8]",
                            "inputId": "000000000000000000000030",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI5"
                        },
                        {
                            "in": {
                                "key": "CI6",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI6",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[9]",
                            "inputId": "000000000000000000000031",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI6"
                        },
                        {
                            "in": {
                                "key": "CI7",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI7",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[10]",
                            "inputId": "000000000000000000000032",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI7"
                        },
                        {
                            "in": {
                                "key": "CI8",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "CI8",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[11]",
                            "inputId": "000000000000000000000033",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "CI8"
                        },
                        {
                            "in": {
                                "key": "SIG",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "SIG",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[12]",
                            "inputId": "000000000000000000000034",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "SIG"
                        },
                        {
                            "in": {
                                "key": "BATT",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "BATT",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[13]",
                            "inputId": "000000000000000000000035",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "BATT"
                        },
                        {
                            "in": {
                                "key": "AIExt1",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AIExt1",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[14]",
                            "inputId": "000000000000000000000036",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt1"
                        },
                        {
                            "in": {
                                "key": "AIExt2",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AIExt2",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[15]",
                            "inputId": "000000000000000000000037",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt2"
                        },
                        {
                            "in": {
                                "key": "AIExt3",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AIExt3",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[16]",
                            "inputId": "000000000000000000000038",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt3"
                        },
                        {
                            "in": {
                                "key": "AIExt4",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AIExt4",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[17]",
                            "inputId": "000000000000000000000039",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt4"
                        },
                        {
                            "in": {
                                "key": "AIExt5",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AIExt5",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[18]",
                            "inputId": "000000000000000000000040",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt5"
                        },
                        {
                            "in": {
                                "key": "AIExt6",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "AIExt6",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[19]",
                            "inputId": "000000000000000000000041",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "AIExt6"
                        },
                        {
                            "in": {
                                "key": "digitalsIn",
                                "moduleId": 0,
                                "deviceId": "000000000000000000000183"
                            },
                            "out": {
                                "key": "digitalsIn",
                                "moduleId": 1
                            },
                            "tagId": "ROSE_092_Rx01[20]",
                            "inputId": "000000000000000000000042",
                            "readable": false,
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": false,
                            "description": "digitalsIn"
                        }
                    ],
                    'plc': {
                        'ip': config.plc.ip,
                        'slot': config.plc.slot
                    },
                    'server': {
                        'subscribe': {
                            'data': config.mqttRockwell.subscribe.data,
                            'control': config.mqttRockwell.subscribe.control
                        },
                        'host': config.mqttRockwell.host,
                        'port': config.mqttRockwell.port,
                        'username': config.mqttRockwell.username,
                        'password': config.mqttRockwell.password
                    },
                    'timeout': [
                        {
                            "inputId": "000000000000000000000015",
                            "timeout": 300, // 5 Minutes
                            "deviceId": "000000000000000000000182"
                        },
                        {
                            "inputId": "000000000000000000000036",
                            "timeout": 300, // 5 Minutes
                            "deviceId": "000000000000000000000183"
                        }
                    ],
                    'txtime': 300, // 5 Minutes
                    'production': true,
                    'authentication': true
                });

                deferred.resolve(response);

                return deferred.promise;
            }
        }
    },
    put: async (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            'email': config.email,
            'appId': config.appId
        };

        payload = JSON.stringify(payload);

        const response = await fetch(config.api + url, {
            'headers': {
                'Accept': '*/*',
                'Referer': '127.0.0.1',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': JSON.stringify(config.token),
                'Content-Length': payload.length
            },
            'body': payload,
            'method': 'PUT'
        });

        const result = await response.json();

        deferred.resolve(result);

        return deferred.promise;
    },
    post: async (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            'email': config.email,
            'appId': config.appId
        };

        payload = JSON.stringify(payload);

        const response = await fetch(config.api + url, {
            'headers': {
                'Accept': '*/*',
                'Referer': '127.0.0.1',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': JSON.stringify(config.token),
                'Content-Length': payload.length
            },
            'body': payload,
            'method': 'POST'
        });

        const result = await response.json();

        deferred.resolve(result);

        return deferred.promise;
    }
};

