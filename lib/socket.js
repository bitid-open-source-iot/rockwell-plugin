const SocketServer = require('websocket').server;

module.exports = class {

    constructor(server) {
        // this.socket = new SocketServer({
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



// const EventEmitter = require('events').EventEmitter;
// const SocketServer = require('websocket').server;

// class WebSocket extends EventEmitter {

//     constructor(server) {
//         super();

//         this.socket = new SocketServer({
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