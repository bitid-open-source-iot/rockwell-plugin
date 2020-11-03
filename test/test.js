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
                                "deviceId": "000000000000000438700926"
                            },
                            "out": {
                                "key": "AI1",
                                "moduleId": 0
                            },
                            "tagId": "Rx[0]",
                            "inputId": "000000000000000000000001",
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
                            "description": "INPUT 1",
                            "value": 0
                        },
                        {
                            "in": {
                                "key": "AI2",
                                "moduleId": 0,
                                "deviceId": config.deviceId
                            },
                            "out": {
                                "key": "AI2",
                                "moduleId": 0
                            },
                            "tagId": "Rx[1]",
                            "inputId": "000000000000000000000002",
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
                            "description": "INPUT 2",
                            "value": 0
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
                            'inputId': '000000000000000000000000',
                            'timeout': 3600,
                            'deviceId': config.deviceId
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
7 - Send MQTT Data              | ✗ |
8 - Recieve MQTT Data           | ✗ |
9 - Close Web Socket            | ✓ |
9 - Close MQTT Socket           | ✓ |
====================================
*/