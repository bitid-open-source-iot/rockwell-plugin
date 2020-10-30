const WebSocketServer = require('websocket').server;

class WebSocket {

    constructor(server) {
        this.socket = new WebSocketServer({
            'httpServer': server,
            'autoAcceptConnections': true
        });
    };

    async send(data) {
        this.socket.connections.map(connection => connection.send(JSON.stringify(data)));
    };

}

module.exports = WebSocket;