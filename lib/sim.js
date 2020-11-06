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
            setTimeout(() => {
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
                    }, 2000);
                }, 2000);
            }, 1000);
        } catch (error) {
            console.log(error);
            this.emit('disconnect', true);
        };
    };

};

module.exports = Sim;