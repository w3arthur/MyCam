const path = require("path");
const PORT = 5000;
const WS_PATH_1 = "/ws_arduino";
const public_folder = 'public_folder';
const getFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);
const broadcast = (clients, message) => clients.forEach((client) => { if (client.readyState === WebSocket.OPEN)  client.send(message); });

//to delete not needed installation
const express = require("express");
const WebSocket = require('ws');
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const wsServer = new WebSocket.Server({ server , path: WS_PATH_1 }) //{port: PORT}
//const router = express.Router();  
//examples here https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express
app.use(require("cookie-parser")());
app.use(express.json({ extended: false }));
app.use(express.urlencoded());


wsServer.on('connection', (socket) => {
    console.log("A client just connected, total clients: " + wsServer.clients.size);
    socket.on('message', (msg) => {
        console.log("Desktop application is connected; message: " + msg);
        wsServer.clients.forEach((client) => {client.send("Message received, " + msg + "")});
        //specific client
        app.locals.clients = wsServer.clients;  // local data set
    });
    socket.on('close', () => {
        console.log('A client just disconnected.')
    });
} );


app.route("/").get(async (req, res) => res.status(200).sendFile(getFile("index.html")) );
app.use("/", express.static(getFile()));  //global public folder

app.route("/api/arduino").get(async (req, res) => {
    console.log('arduino requested');
    res.status(200).send('arduino requested');

    broadcast(req.app.locals.clients, "/api/arduino requested, turn on the lamp")
} );

app.route("*").all((req, res) => res.status(404).send("fail " + req.path) );


server.listen(PORT, () => console.log(`${(new Date().toISOString())} Server is listening on port ${PORT}, (Express + WS)`));