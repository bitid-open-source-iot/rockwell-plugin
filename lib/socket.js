const WebSocketServer = require('websocket').server;

class WebSocket {

    constructor(server) {
        __socket = new WebSocketServer({
            'httpServer': server,
            'autoAcceptConnections': true
        });

        __socket.on('request', (request) => {
            this.send();
        });
    };

    async send(data) {
        __socket.connections.map(connection => connection.send(JSON.stringify(data)));
    };

}

module.exports = WebSocket;