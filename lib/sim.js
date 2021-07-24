/*
    sudo cell_mgmt start APN=internet
    sudo cell_mgmt status
    sudo cell_mgmt stop
*/
const EventEmitter = require('events').EventEmitter;

class Sim extends EventEmitter {

    constructor() {
        super();
    };

    connect() {
        try {
            const cmd = require('node-cmd');
            console.log('Stopping Sim Service');
            cmd.run('sudo cell_mgmt stop');
            setTimeout(() => {
                console.log('Starting Sim Service');
                cmd.run('sudo cell_mgmt start APN=internet');
                setTimeout(() => {
                    console.log('Checking Sim Service Status');
                    cmd.run('sudo cell_mgmt status', (err, data) => {
                        if (err) {
                            console.log(err);
                            this.emit('disconnect', true);
                        } else {
                            console.log(data);
                            this.emit('connect', true);
                        };
                    });
                }, 5000);
            }, 5000);
        } catch (error) {
            console.log(error);
            this.emit('disconnect', true);
        };
    };

};

module.exports = Sim;