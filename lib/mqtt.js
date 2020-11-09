const MQTT = require('mqtt');
const EventEmitter = require('events').EventEmitter;

class MqttSocket extends EventEmitter {

    constructor() {
        super();
    };

    connect(server) {
        try {
            __logger.info('Connecting to mqtt: ' + JSON.stringify(server));

            this.mqtt = MQTT.connect(server.host, {
                'host': server.host,
                'port': server.port,
                'username': server.username,
                'password': server.password
            });

            this.mqtt.on('end', () => {
                __logger.error('Connecting to mqtt: END');
            });

            this.mqtt.on('close', () => {
                __logger.error('Connecting to mqtt: CLOSE');
            });

            this.mqtt.on('offline', () => {
                __logger.error('Connecting to mqtt: OFFLINE');
            });

            this.mqtt.on('disconnect', () => {
                __logger.error('Connecting to mqtt: DISCONNECT');
            });

            this.mqtt.on('error', error => {
                __logger.error(error);
            });
    
            this.mqtt.on('connect', () => {
                __logger.info('Connecting to mqtt: Success');

                this.mqtt.subscribe(server.subscribe.data, (error) => {
                    if (error) {
                        __logger.error(error.message);
                    } else {
                        __logger.info('Subscribed to mqtt data');
                    };
                });
    
                this.mqtt.subscribe(server.subscribe.control, (error) => {
                    if (error) {
                        __logger.error(error.message);
                    } else {
                        __logger.info('Subscribed to mqtt control');
                    };
                });
            });
    
            this.mqtt.on('message', (topic, message) => {
                switch (topic) {
                    case ('rock/v1.1/data'):
                        this.emit('data', JSON.parse(message.toString()));
                        break;
                    case ('rock/v1.1/control'):
                        this.emit('control', JSON.parse(message.toString()));
                        break;
                };
            });
        } catch (error) {
            __logger.error(error.message);   
        };
    };

    send(topic, payload) {
        this.mqtt.publish(topic, JSON.stringify(payload));
    };

};

module.exports = MqttSocket;