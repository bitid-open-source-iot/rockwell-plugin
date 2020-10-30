const Q = require('q');
const fetch = require('node-fetch');
const ErrorResponse = require('./error-response');

exports.deviceId = async (args) => {
    var deferred = Q.defer();

    try {
        var payload = JSON.stringify({
            'typeId': __settings.typeId,
            'barcode': ''
        });
    
        const response = await fetch([__settings.telemetry, '/telemetry/devices/device-id'].join(''), {
            'headers': {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': payload.length
            },
            'body': payload,
            'method': 'PUT'
        });
    
        const result = await response.json();
    
        if (typeof (result.errors) != 'undefined') {
            deferred.reject({
                'error': result
            });
        } else {
            __status = 'active';
            __deviceId = result.deviceId;
            deferred.resolve(args);
        };
    } catch (error) {
        var err = new ErrorResponse();
        err.error.code = 401;
        err.error.errors[0].code = 401;
        err.error.errors[0].reason = error.message;
        err.error.errors[0].message = error.message;
        deferred.reject(err);
    };

    return deferred.promise;
};

exports.authenticate = async (args) => {
    var deferred = Q.defer();

    try {
        var payload = JSON.stringify({
            'header': {
                'email': args.req.body.header.email,
                'appId': args.req.body.header.appId
            },
            'deviceId': __deviceId
        });
    
        const response = await fetch([__settings.telemetry, '/telemetry/devices/get'].join(''), {
            'headers': {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': args.req.headers.authorization,
                'Content-Length': payload.length
            },
            'body': payload,
            'method': 'POST'
        });
    
        const result = await response.json();
    
        if (typeof (result.errors) != 'undefined') {
            deferred.reject({
                'error': result
            });
        } else {
            deferred.resolve(args);
        };
    } catch (error) {
        var err = new ErrorResponse();
        err.error.code = 401;
        err.error.errors[0].code = 401;
        err.error.errors[0].reason = error.message;
        err.error.errors[0].message = error.message;
        deferred.reject(err);
    };

    return deferred.promise;
};