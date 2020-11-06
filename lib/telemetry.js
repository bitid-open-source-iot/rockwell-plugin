const fetch = require('node-fetch');
const EventEmitter = require('events').EventEmitter;

class Telemetry extends EventEmitter {

    constructor() {
        super();

        this.deviceId = null;
    };

    async connect(barcode) {
        try {
            __logger.info('Connecting to Telemetry')

            var payload = JSON.stringify({
                'typeId': __settings.typeId,
                'barcode': barcode
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
                __logger.error('Connecting to Telemetry: Fail ' + JSON.stringify(result));
                this.emit('inactive');
            } else {
                __logger.info('Connecting to Telemetry: Success');
                this.deviceId = result.deviceId;
                this.emit('active');
            };
        } catch (error) {
            __logger.error('Connecting to Telemetry: Fail ' + error.message);
            this.emit('inactive');
        };
    };

}

module.exports = Telemetry;