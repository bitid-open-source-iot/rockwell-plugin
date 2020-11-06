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

    test() {
        cmd.get('date', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log('the current working dir is : ',data)
            };
        });
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
            } else {
                console.log(data);
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

};

module.exports = Sim;