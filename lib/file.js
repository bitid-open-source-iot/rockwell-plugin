const fs = require('fs');

class SystemFile {

    constructor(path) {
        this.path = path;
        this.value = require(this.path);
    };

    async read() {
        this.value = require(this.path);
        return this.value;
    };

    async save(data) {
        fs.writeFileSync(this.path, JSON.stringify(data, null, 4));
    };

};

module.exports = SystemFile;