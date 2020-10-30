const { Tag, Controller, EthernetIP } = require('ethernet-ip');;
const DATATYPES = EthernetIP.CIP.DataTypes.Types;
const controller = new Controller();
const EventEmitter = require('events').EventEmitter;

class Rockwell extends EventEmitter {

    constructor() {
        super();
  
        this.io = __settings.io;
        this.io.map(item => {
            item.tag = new Tag(item.tagId, null, DATATYPES[item.interface]);
        });
    };

    barcode() {
        return controller.properties.serial_number;
    };

    connect(plc) {
        controller.connect(plc.ip, plc.port)
        .then(() => {
            this.emit('connect', true);
        })
        .catch(error => {
            this.emit('disconnect', error);
        });
    };

    async read() {
        const data = await this.io.reduce(async (proma, item) => {
            await controller.readTag(item.tag);
            item.value = item.tag.value;
            return this.io;
        }, []);
        this.emit('data', data);
    };

    async watch() {
        const data = await this.io.reduce(async (items, item, a) => {
            await controller.readTag(item.tag);
            item.value = item.tag.value;
            return this.io;
        }, []);
        
        this.emit('read', data.map(item => {
            return {
                'as': item.as,
                'type': item.type,
                'value': item.value,
                'tagId': item.tagId,
                'moduleId': item.moduleId,
                'allowance': item.allowance,
                'interface': item.interface
            };
        }));
    };

    write(tagId, value) {
        this.io.map(item => {
            if (item.tagId == tagId) {
                item.tag.value = value;
                controller.writeTag(item.tag);
            };
        });
    };

};

module.exports = Rockwell;