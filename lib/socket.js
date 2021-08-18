const WebSocketServer = require('websocket').server;

class WebSocket {

    constructor(server) {
        // this.socket = new WebSocketServer({
        //     'httpServer': server,
        //     'autoAcceptConnections': true
        // });

        // this.socket.on('request', (connection) => {
            // this.emit('connection', connection);
        // });
    };

    async send(data) {
        // this.socket.connections.map(connection => connection.send(JSON.stringify(data)));
    };

}

module.exports = WebSocket;



// const EventEmitter = require('events').EventEmitter;
// const WebSocketServer = require('websocket').server;

// class WebSocket extends EventEmitter {

//     constructor(server) {
//         super();

//         this.socket = new WebSocketServer({
//             'httpServer': server,
//             'autoAcceptConnections': true
//         });

//         this.socket.on('request', (connection) => {
//             this.emit('connection', connection);
//         });
//     };

//     async send(data) {
//         this.socket.connections.map(connection => connection.send(JSON.stringify(data)));
//     };

// }

// module.exports = WebSocket;