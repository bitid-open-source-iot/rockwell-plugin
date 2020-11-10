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
        controller.connect(plc.ip, plc.slot)
        .then(() => {
            this.emit('connect', true);
        })
        .catch(error => {
            this.emit('disconnect', error);
        });
    };

    async read() {
        __logger.info('Reading IO')
        const data = await this.io.reduce(async (proma, item) => {
            if (item.readable) {
                await controller.readTag(item.tag);
                item.value = item.tag.value;
            } else {
                item.value = 0;
            };
            return this.io;
        }, []);
        this.emit('data', data);
    };

    async watch() {
        try {
            const data = await this.io.reduce(async (items, item, a) => {
                if (item.readable) {
                    await controller.readTag(item.tag);
                    item.value = item.tag.value;
                } else {
                    item.value = 0;
                };
                return this.io;
            }, []);
            
            this.emit('read', data.map(item => {
                return {
                    'in': item.in,
                    'out': item.out,
                    'value': item.value,
                    'tagId': item.tagId,
                    'inputId': item.inputId,
                    'allowance': item.allowance,
                    'interface': item.interface,
                    'description': item.description
                };
            }));
        } catch (error) {
            __logger.error(error);
        };
    };

    write(inputId, value) {
        try {
            this.io.map(async item => {
                if (item.inputId == inputId && item.tag.value != value && item.writeable) {
                    item.tag.value = parseInt(value);
                    await controller.writeTag(item.tag);
                };
            });
        } catch (error) {
            __logger.error(error);
        };
    };

};

module.exports = Rockwell;