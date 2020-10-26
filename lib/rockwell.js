const MQTT = require('mqtt');
const { Tag, Controller } = require('ethernet-ip');

const controller = new Controller();

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

        Object.keys(modules).map(moduleId => {
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
                'time': new Date().getTime(),
                'date': new Date().getTime(),
                'BATT': 0,
                'AIExt1': 0,
                'AIExt2': 0,
                'AIExt3': 0,
                'AIExt4': 0,
                'AIExt5': 0,
                'AIExt6': 0,
                'AIExt7': 0,
                'AIExt8': 0,
                'TxFlag': 0,
                'moduleId': parseInt(moduleId),
                'digitalsIn': 0
            };

            modules[moduleId].map(input => {
                if (status.hasOwnProperty(input.key)) {
                    if (input.key.indexOf('digitalsIn') > -1) {
                        // digital
                    } else {
                        status[input.key] = input.value;
                    };
                };
            });

            this.mqtt.publish(__settings.server.subscribe, JSON.stringify(status));
        });
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

            this.io.map(async (item) => {
                item.tag = new Tag(item.tagId.replace('#', item.pin));
            });

            await controller.connect(__settings.plc.ip, __settings.plc.port);

            await controller.scan();

            await controller.forEach(tag => {
                tag.on('Changed', (tag, previous) => {
                    var trigger = false;

                    for (let i = 0; i < this.io.length; i++) {
                        if (this.io[i].tag.instance_id == tag.instance_id) {
                            if (Math.abs(tag.value - previous.value) > this.io[i].allowance) {
                                trigger = true;
                            };
                            this.io[i].value = tag.value;
                            break;
                        };
                    };

                    if (trigger) {
                        // this.send();
                    };
                });
            });
            
            await this.send();
            
            setInterval(async () => await this.send(), (__settings.txtime * 1000));
        } catch (error) {
            __logger.error(error.message);
        };
    };

    async read(moduleId, key) {
        let value = null;
        for (let i = 0; i < this.io.length; i++) {
            if (this.io[i].module == moduleId && this.io[i].as == key) {
                await controller.readTag(this.io[i].tag);
                value = this.io[i].tag.value;
                break;
            };
        };
        return value;
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