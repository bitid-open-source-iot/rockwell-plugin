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

    connect() {
        try {
            __logger.info('Stopping Sim Service');
            cmd.run('sudo cell_mgmt stop');
            setTimeout(() => {
                __logger.info('Starting Sim Service');
                cmd.run('sudo cell_mgmt start APN=internet');
                setTimeout(() => {
                    __logger.info('Checking Sim Service Status');
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