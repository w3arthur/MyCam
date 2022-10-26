const config = require('../config')
const {webSocketPath1, webSocketPath1ApprovedMessage} = config.webSocket;
const api = require('../api');
const {WebSocket, webSocketBroadcast} = api.webSocket;

const wsServer1 = (server) => {
    const wsServer1 = new WebSocket.Server({ server , path: webSocketPath1 }) //{port: PORT}
    //web socket:
    wsServer1.on('connection', (socket) => {
        console.log("A client just connected, total clients: " + wsServer1.clients.size);
        socket.on('message', (msg) => {
            console.log("Desktop application is sending message: " + msg);
            if(msg == webSocketPath1ApprovedMessage) app.locals.clients1 = wsServer1.clients;  //specific client
            wsServer1.clients.forEach((client) => {client.send("Message received by server, " + msg + "")});
        });
        socket.on('close', () => {
            app.locals.clients1 = wsServer1.clients;
            console.log('the desktop application just disconnected!, client still connected: ' + wsServer1.clients.size)
            console.log('Please restart the desktop application ')
        });
    } );
}


module.exports = wsServer1;