const MQTT = require('mqtt');
const { Tag, Controller, EthernetIP } = require('ethernet-ip');;
const { SINT, INT, DINT, REAL, BOOL } = EthernetIP.CIP.DataTypes.Types;

const DATATYPES = {
    'INT': INT,
    'SINT': SINT,
    'DINT': DINT,
    'REAL': REAL,
    'BOOL': BOOL
};

const controller = new Controller();
controller.scan_rate = 50;

class Rockwell {

    constructor() {
        this.io = __settings.io;
    };

    async send() {
        const data = this.io.filter(o => o.type == 'input' && typeof(o.value) != 'undefined' && o.value !== null && o.value !== '').map(o => {
            return {
                'key': o.as,
                'value': o.value,
                'moduleId': o.moduleId
            };
        });

        const modules = data.reduce((group, input) => {
            if (group.hasOwnProperty(input.moduleId)) {
                group[input.moduleId].push(input);
            } else {
                group[input.moduleId] = [input];
            };
            return group;
        }, {});

        Object.keys(modules).map(async moduleId => {
            var status = {
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
                if (status.hasOwnProperty(input.key)) {
                    status[input.key] = input.value;
                };
            });

            if (typeof(__deviceId) != 'undefined' && __deviceId !== null && __deviceId !== '') {
                this.mqtt.publish(__settings.server.subscribe, JSON.stringify({
                    'rtuId': __deviceId,
                    'dataIn': status,
                    'rtuDate': new Date().getTime(),
                    'moduleId': parseInt(moduleId)
                }));
            };
        });
    };

    async read() {
        await this.io.reduce(async (proma, item, a) => {
            await controller.readTag(item.tag);
            item.value = item.tag.value;
            return this.io;
        }, []);
        
        const payload = JSON.stringify({
            'inputs': this.io.map(io => {
                return {
                    'as': io.as,
                    'pin': io.pin,
                    'type': io.type,
                    'tagId': io.tagId,
                    'value': io.value,
                    'moduleId': io.moduleId,
                    'allowance': io.allowance,
                    'interface': io.interface
                };
            }),
            'status': __status,
            'deviceId': __deviceId
        });

        __socket.send(payload);

        return this.io;
    };

    async connect() {
        try {
            this.mqtt = MQTT.connect(__settings.server.host, {
                'host': __settings.server.host,
                'port': __settings.server.port,
                'username': __settings.server.username,
                'password': __settings.server.password
            });
    
            this.mqtt.on('connect', () => {
                this.mqtt.subscribe(__settings.server.subscribe, (error) => {
                    if (error) {
                        __logger.error(error.message);
                    } else {
                        this.mqtt.on('message', (topic, message) => {
                            message = JSON.parse(message.toString());
                            console.log(message);
                        });
                    };
                });
            });

            this.io.map(item => {
                item.tag = new Tag(item.tagId.replace('#', item.pin), null, DATATYPES[item.interface]);
            });

            controller.connect(__settings.plc.ip, __settings.plc.port)
            .then(async () => {
                __logger.info('Connected to PLC');

                __barcode = controller.properties.serial_number;

                controller.scan();

                await this.read();
                
                setInterval(async () => await this.read(), 5000);
                
                await this.send();
                
                setInterval(async () => await this.send(), (__settings.txtime * 1000));

                return true;
            })
            .catch(err => {
                __logger.error(err);
                return false;
            });
        } catch (error) {
            __logger.error(error.message);
            return false;
        };
    };

    async write(moduleId, key, value) {
        let value = null;
        for (let i = 0; i < this.io.length; i++) {
            if (this.io[i].module == moduleId && this.io[i].as == key) {
                this.io[i].tag.value = value;
                await controller.writeTag(this.io[i].tag);
                break;
            };
        };
        return value;
    };

};

module.exports = Rockwell;