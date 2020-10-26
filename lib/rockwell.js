const MQTT = require('mqtt');
const { EventEmitter } = require('events');
const { Tag, Controller } = require('ethernet-ip');

const controller = new Controller();

class Rockwell extends EventEmitter {

    constructor() {
        super();

        this.io = __settings.io;
    };

    async send() {
        const data = this.io.map(o => {
            return {
                'key': o.as,
                'value': o.value,
                'moduleId': o.module
            };
        });

        this.emit('change', data);
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
                this.mqtt.subscribe(this.server.subscribe, (error) => {
                    if (error) {
                        __logger.error(error.message);
                    } else {
                        this.mqtt.on('message', (topic, message) => {
                            console.log('mqtt message received', { 'topic': topic, 'message': message })
                            this.processMqttData({ topic: topic, message: message })
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
                    for (let i = 0; i < this.io.length; i++) {
                        if (this.io[i].tag.instance_id == tag.instance_id) {
                            this.io[i].value = tag.value;
                            break;
                        };
                    };

                    this.send();
                });
            });
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

    async processMqttData(data) {
        let message = JSON.parse(data.message)
        let self = this

        if (typeof message.txType != 'undefined') {
            if (typeof message.data != 'undefined' && message.source != 'server') {
                console.log('processMqttData', message.txType)
                switch (message.txType) {
                    case ('control'):
                        self.compileWrite(message.data)
                        self.txStructure.txType = 'controlSuccess'
                        self.txStructure.data = message.data
                        self.mqtt.publish(self.mqttSubscribe, JSON.stringify(self.txStructure))
                        break
                    case ('updateCommands'):
                        self.commands = message.data
                        self.index = 0
                        let response = {}
                        try{
                            response = await self.compileOutputs(response)
                            self.txStructure.txType = 'updateCommandsSuccess'
                            self.txStructure.data = self.commands
                            self.mqtt.publish(self.mqttSubscribe, JSON.stringify(self.txStructure))
                        }catch(e){
                            console.log('error updateCommands',e)
                        }
                        break
                    case ('statusCommands'):
                        self.txStructure.txType = 'statusCommandsSuccess'
                        self.txStructure.data = self.commands
                        self.mqtt.publish(self.mqttSubscribe, JSON.stringify(self.txStructure))
                        break
                    case ('status'):
                        self.sendDataViaMqtt('statusSuccess')
                        break
                    default:
                        console.log('unhandled/ignored txType', message.txType)
                }
            }
        } else {
            console.log('unhandled processMqttData')
        }
    };

};

module.exports = Rockwell;