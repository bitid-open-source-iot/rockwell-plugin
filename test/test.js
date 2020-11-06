var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

var Q = require('q');
var MQTT = require('mqtt');
var fetch = require('node-fetch');
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var config = require('./config.json');
var WebSocketClient = require('websocket').client;

var mqtt = null;
var socket = new WebSocketClient();
var connection = null;

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

        mqtt = MQTT.connect(config.mqtt.socket, {
            'host': config.mqtt.socket,
            'port': config.mqtt.port,
            'username': config.mqtt.username,
            'password': config.mqtt.password
        });

        mqtt.on('connect', () => {
            done();
        });
    });
});

describe('Subscribe', function () {
    it('Data Topic', function (done) {
        this.timeout(5000);

        mqtt.subscribe(config.mqtt.subscribe.data, (error) => {
            if (error) {
                done(error.message);
            } else {
                done();
            };
        });
    });

    it('Control Topic', function (done) {
        this.timeout(5000);

        mqtt.subscribe(config.mqtt.subscribe.control, (error) => {
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
    it(config.mqtt.subscribe.data, function (done) {
        this.timeout(5000);

        mqtt.on('message', (topic, message) => {
            if (topic == config.mqtt.subscribe.data) {
                var result = JSON.parse(message.toString())
                result.should.have.property('rtuId');
                result.should.have.property('dataIn');
                result.should.have.property('rtuDate');
                result.should.have.property('moduleId');
                done();
            };
        });

        mqtt.publish(config.mqtt.subscribe.data, JSON.stringify({
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

    it(config.mqtt.subscribe.control, function (done) {
        this.timeout(5000);

        mqtt.on('message', (topic, message) => {
            if (topic == config.mqtt.subscribe.control) {
                var result = JSON.parse(message.toString())
                result.should.have.property('rtuId');
                result.should.have.property('dataIn');
                result.should.have.property('rtuDate');
                result.should.have.property('moduleId');
                done();
            };
        });

        mqtt.publish(config.mqtt.subscribe.control, JSON.stringify({
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
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
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
                            "description": "digitalsIn"
                        }
                    ],
                    'plc': {
                        'ip': config.plc.ip,
                        'slot': config.plc.slot
                    },
                    'server': {
                        'subscribe': {
                            'data': config.mqtt.subscribe.data,
                            'control': config.mqtt.subscribe.control
                        },
                        'host': config.mqtt.host,
                        'port': config.mqtt.port,
                        'username': config.mqtt.username,
                        'password': config.mqtt.password
                    },
                    'timeout': [
                        {
                            "inputId": "000000000000000000000015",
                            "timeout": 360,
                            "deviceId": "000000000000000000000182"
                        },
                        {
                            "inputId": "000000000000000000000036",
                            "timeout": 360,
                            "deviceId": "000000000000000000000183"
                        }
                    ],
                    'txtime': 360,
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