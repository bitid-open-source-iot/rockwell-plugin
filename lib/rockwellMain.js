const Rockwell = require('./rockwell');
const publicIp = require('public-ip').v4;
const Telemetry = require('./telemetry');
const MqttSocket = require('./mqtt');
const EventEmitter = require('events').EventEmitter;

class RockwellMain extends EventEmitter {

    constructor() {
        super();

        this.init()
    }

    async init() {
        try {
            const ip = await publicIp();
            const mqtt = new MqttSocket();
            const rockwell = new Rockwell();
            const telemetry = new Telemetry();

            mqtt.on('control', event => {
                var now = new Date().getTime();
                /* HARD CODE TO FIX DATE ON SITE */
                event.rtuDate = new Date(event.rtuDate);
                event.rtuDate.setHours(event.rtuDate.getHours() + 2);
                /* HARD CODE TO FIX DATE ON SITE */
                __settings.timeout.map(device => {
                    if (event.rtuId == device.deviceId && (now - event.rtuDate) < (device.timeout * 1000)) {
                        device.last = new Date().getTime();
                        device.status = 'healthy';
                        // // write to registers
                        // __settings.io.map(item => {
                        //     if (item.writeable && event.rtuId == item.in.deviceId && event.moduleId == item.in.moduleId) {
                        //         rockwell.write(item.inputId, event.dataIn[item.in.key]);
                        //     };
                        // });
                        // set input register comms healthy
                        rockwell.write(device.inputId, 1);
                    };
                });

                __settings.io.map(item => {
                    if (item.writeable && event.rtuId == item.in.deviceId && event.moduleId == item.in.moduleId) {
                        console.log('control event: ', event);
                        rockwell.write(item.inputId, event.dataIn[item.in.key]);
                    };
                });
            });

            rockwell.on('data', data => {
                data = data.filter(o => typeof (o.value) != 'undefined' && o.value !== null && o.value !== '');
                
                if (data.length > 0) {
                    this.emit('data', data);
                };

                const modules = data.reduce((group, input) => {
                    if (group.hasOwnProperty(input.out.moduleId)) {
                        group[input.out.moduleId].push(input);
                    } else {
                        group[input.out.moduleId] = [input];
                    };
                    return group;
                }, {});

                Object.keys(modules).map(async moduleId => {
                    if (typeof(moduleId) != 'undefined' && moduleId != null && moduleId != 'undefined') {
                        var status = {
                            // 'IP': ip,
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
                        };

                        modules[moduleId].map(input => {
                            if (status.hasOwnProperty(input.out.key)) {
                                status[input.out.key] = input.value;
                            };
                        });

                        if (typeof (telemetry.deviceId) != 'undefined' && telemetry.deviceId !== null) {
                            console.log('Publishing Data To Server');
                            console.log(rockwell.barcode(), status);
                            mqtt.send(__settings.server.subscribe.data, {
                                'rtuId': telemetry.deviceId,
                                'dataIn': status,
                                'barcode': rockwell.barcode(),
                                'rtuDate': new Date().getTime(),
                                'moduleId': moduleId
                            });
                        };
                    };
                });
            });

            rockwell.on('read', inputs => {
                __socket.send({
                    'inputs': inputs,
                    'barcode': rockwell.barcode(),
                    'deviceId': telemetry.deviceId
                });
            });

            rockwell.on('connect', () => {
                console.log('Rockwell PLC Connected: ' + rockwell.barcode());

                telemetry.connect(rockwell.barcode());
            });

            rockwell.on('disconnect', () => {
                console.log('plc connection failure, reconnecting in a few seconds');
                setTimeout(() => {
                    rockwell.connect(__settings.plc);
                }, 3000);
            });

            telemetry.on('active', event => {
                __deviceId = telemetry.deviceId;
                console.log('Telemetry Connected: ' + telemetry.deviceId);

                /* FOR TESTING ONLY */
                rockwell.write("0000000000000000000WRITE", 100);
                /* FOR TESTING ONLY */

                setTimeout(async () => rockwell.watch(), 5000);

                setInterval(async () => rockwell.watch(), 30000);

                setTimeout(async () => rockwell.read(), 7500);

                setInterval(() => rockwell.read(), (__settings.txtime * 1000));

                __settings.timeout.map(device => {
                    device.last = new Date().getTime();
                    device.status = 'healthy';
                    setInterval(() => {
                        var now = new Date().getTime();
                        if (now - device.last > (device.timeout * 1000) && device.status == 'healthy') {
                            // set input register comms unhealthy
                            rockwell.write(device.inputId, 0);
                            device.status = 'unhealthy';
                        };
                    }, (device.timeout * 1000));
                });
            });

            telemetry.on('inactive', event => {
                __deviceId = null;
                setTimeout(() => telemetry.connect(rockwell.barcode()), 3000);
            });

            __socket.on('connection', connection => {
                __socket.send({
                    'inputs': [],
                    'barcode': rockwell.barcode(),
                    'deviceId': telemetry.deviceId
                });
            });

            mqtt.connect(__settings.server);

            rockwell.connect(__settings.plc);
        } catch (error) {
            console.log(error.message);
        };
    }

    getDeviceId() {
        return telemetry.deviceId;
    }
}
module.exports = RockwellMain



