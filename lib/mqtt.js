const MQTT = require('mqtt');
const EventEmitter = require('events').EventEmitter;

class MqttSocket extends EventEmitter {

    constructor() {
        super();
    };

    connect(server) {
        let self = this
        try {
            console.log('Connecting to mqtt: ' + JSON.stringify(server));

            setInterval(function(){
                if(self.mqtt.connected != true){
                    self.mqtt = MQTT.connect([server.host, ':', server.port].join(''), {
                        'host': server.host,
                        'port': server.port,
                        'clean': true,
                        'username': server.username,
                        'password': server.password,
                        'keepalive': 60
                    });
                }
            },10000)

            this.mqtt = MQTT.connect([server.host, ':', server.port].join(''), {
                'host': server.host,
                'port': server.port,
                'clean': true,
                'username': server.username,
                'password': server.password,
                'keepalive': 60
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
                console.log('Connecting to mqtt: Success',server);

                this.mqtt.subscribe(server.subscribe.data, (error) => {
                    if (error) {
                        __logger.error(error);
                    } else {
                        console.log('Subscribed to mqtt data');
                    };
                });
    
                this.mqtt.subscribe(server.subscribe.control, (error) => {
                    if (error) {
                        __logger.error(error);
                    } else {
                        console.log('Subscribed to mqtt control');
                    };
                });
            });



    
            /**
             * Original Rockwell stuff
            */
            this.mqtt.on('message', (topic, message) => {
                switch (topic) {
                    case ('/rock/v1.1/data'):
                        this.emit('data', JSON.parse(message.toString()));
                        break;
                    case ('/rock/v1.1/control'):
                        this.emit('control', JSON.parse(message.toString()));
                        break;

                    case('/kGateway/edge/data'):
                        break
                    default:
                        if(topic.includes('kbeacon/publish/')){
                            this.emit('data',{topic,message})
                        }else{
                            console.error('unhandled switch mqtt topic', topic)
                        }
                };
            });

        } catch (error) {
            __logger.error(error);   
        };
    };

    send(topic, payload) {
        this.mqtt.publish(topic, JSON.stringify(payload));
    };

};

module.exports = MqttSocket;