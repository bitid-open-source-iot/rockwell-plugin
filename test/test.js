var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

var Q = require('q');
var fetch = require('node-fetch');
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var config = require('./config.json');

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
                            "analog": {
                                "scaling": {
                                    "raw": {
                                        "low": 0,
                                        "high": 0
                                    },
                                    "scaled": {
                                        "low": 0,
                                        "high": 0
                                    },
                                    "type": "none"
                                },
                                "key": "AI1",
                                "units": "",
                                "offset": 0,
                                "decimals": 0
                            },
                            "digital": {
                                "bit": 0,
                                "low": null,
                                "high": null
                            },
                            "type": "analog",
                            "tagId": "Rx[0]",
                            "hidden": false,
                            "inputId": "5fa01e38a44376bcbdbee85b",
                            "deviceId": "000000000000000438700926",
                            "priority": false,
                            "moduleId": 0,
                            "writekey": "AI1",
                            "interface": "DINT",
                            "allowance": 0,
                            "writeable": true,
                            "description": "INPUT 1",
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
                            'deviceId': '000000000000000000000000'
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
=====================================
1 - Connect To Web Socket
2 - Connect To MQTT Socket
3 - Subscribe To Data Topic
4 - Subscribe To Control Topic
5 - Get Config
6 - Update Config
7 - Send MQTT Data
8 - Recieve MQTT Data
=====================================
*/