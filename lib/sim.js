/*
    sudo cell_mgmt start APN=internet
    sudo cell_mgmt status
    sudo cell_mgmt stop
*/
const cmd = require('node-cmd');
const EventEmitter = require('events').EventEmitter;

class Sim extends EventEmitter {

    constructor() {
        super();
    };

    stop() {
        cmd.get('sudo cell_mgmt stop', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
            };
        });
    };

    start() {
        cmd.get('sudo cell_mgmt start APN=internet', (err, data) => {
            if (err) {
                console.error(err);
                this.emit('disconnect', true);
            } else {
                console.log(data);
                this.emit('connect', true);
            };
        });
    };

    status() {
        cmd.get('sudo cell_mgmt status', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
            };
        });
    };

    connect() {
        cmd.get('sudo cell_mgmt status', (err, data) => {
            if (err) {
                console.error(err);
                this.emit('disconnect', true);
            } else {
                console.log(JSON.stringify(data));
                this.emit('connect', true);
            };
        });
    };

};

module.exports = Sim;