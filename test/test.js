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
                    result.should.have.property('port');
                    result.should.have.property('thingapp');
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

    it('/api/config/barcode', function (done) {
        this.timeout(5000);

        tools.api.config.barcode()
            .then((result) => {
                try {
                    result.should.have.property('barcode');
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
                        'port',
                        'thingapp',
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
                            "pin": 0,
                            "tag": "Rx[#]",
                            "type": "input",
                            "moduleId": 0
                        },
                        {
                            "pin": 1,
                            "tag": "Rx[#]",
                            "type": "input",
                            "moduleId": 0
                        }
                    ],
                    'plc': {
                        'ip': '127.0.0.1',
                        'port': 0
                    },
                    'port': 3000,
                    'thingapp': 'ws://127.0.0.1:3000',
                    'production': false
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            barcode: async () => {
                var deferred = Q.defer();

                const response = await tools.put('/api/config/barcode', {});

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