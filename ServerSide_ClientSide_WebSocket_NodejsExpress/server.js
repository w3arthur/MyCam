const path = require('path');
const PORT = 3777;
const WS_PATH_1 = '/ws_arduino';
const WS_PATH_1_APPROVAL_MESSAGE = 'desktopApplication';    // if receive another one will not include to ws clients list
const API_TURNON_LED_RETURN = '1';
const public_folder = 'public_folder';
const SECRET_KEY = 'secretKey';
const ARDUINO_VALUE_MAX_LENGTH = 20;

const getLocalFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);

const webSocketBroadcast = (clients, message) => {
    try{ if(!clients || clients.size == 0) throw new Error();
        clients.forEach((client) => { if (client.readyState === WebSocket.OPEN)  client.send(message); });
        return true;
    } catch {return false;}
}


//to delete not needed installation
const express = require("express");
const WebSocket = require('ws');
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const wsServer1 = new WebSocket.Server({ server , path: WS_PATH_1 }) //{port: PORT}
//const router = express.Router();  
//examples here https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express
app.use(require("cookie-parser")());
app.use(express.json({ extended: false }));
app.use(express.urlencoded());

//http:
app.use("/", express.static(getLocalFile()));  //global public folder
app.route("/").get(async (req, res) => res.status(200).sendFile(getLocalFile("index.html")) );
app.route("/test").get(async (req, res) => res.status(200).sendFile(getLocalFile("test.html")) );

app.route("/api/rtmp_auth").post(async (req, res) => {
    const streamKey = req.body.key;
    if (streamKey === SECRET_KEY) {return res.status(200).send(); } // You can make a database of users instead :) 
    else return res.status(403).send(); //Reject the stream
} );

app.route("/api/arduino/:param").get(async (req, res) => {
    let param = req.params.param;
    if (param.length > ARDUINO_VALUE_MAX_LENGTH) param = param.substring(0, ARDUINO_VALUE_MAX_LENGTH);
    const result = webSocketBroadcast(req.app.locals.clients1, param);   ///api/arduino requested, turn on the lamp
    console.log('arduino requested ' + (result ? 'sent' : 'not sent!'));
    return res.status(200).send('arduino requested ' + (result ? 'sent' : 'not sent!'));
} );

app.route("*").all((req, res) => res.status(404).send("fail " + req.path) );

server.listen(PORT, () => console.log(`${(new Date().toISOString())} Server is listening on port ${PORT}, (Express + WS)`));


//web socket:
wsServer1.on('connection', (socket) => {
    console.log("A client just connected, total clients: " + wsServer1.clients.size);
    socket.on('message', (msg) => {
        console.log("Desktop application is sending message: " + msg);
        if(msg == WS_PATH_1_APPROVAL_MESSAGE) app.locals.clients1 = wsServer1.clients;  //specific client
        wsServer1.clients.forEach((client) => {client.send("Message received by server, " + msg + "")});
    });
    socket.on('close', () => {
        app.locals.clients1 = wsServer1.clients;
        console.log('the desktop application just disconnected!, client still connected: ' + wsServer1.clients.size)
        console.log('Please restart the desktop application ')
    });
} );


