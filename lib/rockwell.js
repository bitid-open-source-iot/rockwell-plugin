const { Tag, Controller } = require('ethernet-ip');

const controller = new Controller();

class Rockwell {

    constructor() {
        this.io = __settings.io;
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

    async connect() {
        try {
            this.io.map(async (item) => {
                item.tag = new Tag(item.tagId.replace('#', item.pin));
            });
            await controller.connect(__settings.plc.ip, __settings.plc.port);
        } catch (error) {
            __logger.error(error.message);
        };
    };

};

module.exports = Rockwell;