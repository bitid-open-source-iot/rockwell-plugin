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
                console.log(err);
            } else {
                console.log(data);
            };
        });
    };

    start() {
        cmd.get('sudo cell_mgmt start APN=internet', (err, data) => {
            if (err) {
                console.log(err);
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
                console.log(err);
            } else {
                console.log(data);
            };
        });
    };

    connect() {
        try {
            cmd.get('sudo cell_mgmt status', (err, data) => {
                if (err) {
                    console.log(err);
                    this.emit('disconnect', true);
                } else {
                    console.log("data: ", data);

                    var result = {};

                    if (data.indexOf('\n') > -1) {
                        data = data.split('\n');
                    } else {
                        data = [data];
                    };

                    data.map(str => {
                        if (str.indexOf(': ') > -1) {
                            var tmp = str.split(': ');
                            result[tmp[0]] = tmp[1];
                        };
                    });
                    console.log(JSON.stringify(result));
                    this.emit('connect', true);
                };
            });
        } catch (error) {
            console.log(error);
        };
    };

};

module.exports = Sim;