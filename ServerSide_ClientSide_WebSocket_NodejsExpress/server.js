const path = require('path');
const PORT = 8000;
const WS_PATH_1 = '/ws_arduino';
const WS_PATH_1_APPROVAL_MESSAGE = 'desktopApplication';    // if receive another one will not include to ws clients list
const API_TURNON_LED_RETURN = '1';
const public_folder = 'public_folder';
const getFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);
const broadcast = (clients, message) => {
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
app.use("/", express.static(getFile()));  //global public folder
app.route("/").get(async (req, res) => res.status(200).sendFile(getFile("index.html")) );
app.route("/test").get(async (req, res) => res.status(200).sendFile(getFile("test.html")) );
app.route("/api/arduino").get(async (req, res) => {
    const result = broadcast(req.app.locals.clients1, API_TURNON_LED_RETURN);   ///api/arduino requested, turn on the lamp
    res.status(200).send('arduino requested ' + (result ? 'sent' : 'not sent!'));
    console.log('arduino requested ' + (result ? 'sent' : 'not sent!'));
} );

app.route("/auth").all(function (req, res) {
    const streamkey = req.body.key;   /* This server is only available to nginx */
  //  if (streamkey === "supersecret") return res.status(200).send(); /* You can make a database of users instead :) */
   // return res.status(403).send(); /* Reject the stream */
   return res.status(200).send();
  });


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


