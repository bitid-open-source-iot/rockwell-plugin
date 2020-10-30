const fetch = require('node-fetch');
const EventEmitter = require('events').EventEmitter;

class Telemetry extends EventEmitter {

    constructor() {
        super();

        this.deviceId = null;
    };

    async connect(barcode) {
        try {
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
                this.emit('inactive');
            } else {
                this.deviceId = result.deviceId;
                this.emit('active');
            };
        } catch (error) {
            this.emit('inactive');
        };
    };

}

module.exports = Telemetry;