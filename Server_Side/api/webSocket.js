const config = require('../config');
const {webSocketPath1, webSocketPath1ApprovedMessage} = config.webSocket;

const webSocketBroadcast = (clients, message) => {
    try{ if(!clients || clients.size == 0) throw new Error();
        clients.forEach((client) => { if (client.readyState === WebSocket.OPEN)  client.send(message); });
        return true;
    } catch {return false;}
}



const WebSocket = require('ws');


module.exports = { 
    webSocketBroadcast, WebSocket
};