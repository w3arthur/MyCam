const path = require("path");
const PORT = 5000;
const WS_PATH = "/ws";
const public_folder = 'public_folder';
const getFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);

//to delete not needed installation
const express = require("express");
const WebSocket = require('ws');
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const wsServer = new WebSocket.Server({ server , path: WS_PATH }) //{port: PORT}
//const router = express.Router();  
//examples here https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express


wsServer.on('connection', (socket) => {
    console.log("A client just connected");
    socket.on('message', (msg) => {
        console.log("Desktop application is connected; message: " + msg);
        
        wsServer.clients.forEach((client) => {client.send(msg + " Return :) ")});
        //specific client
    });
    socket.on('close', () => {
        console.log('A client just disconnected.')
    });
} );

app.use(require("cookie-parser")());
app.use(express.json({ extended: false }));
app.use(express.urlencoded());

app.route("/").get(async (req, res) => res.status(200).sendFile(getFile("index.html")) );
app.use("/", express.static(getFile()));  //global public folder
app.route("/arduino").get(async (req, res) => {


} );
app.route("*").all((req, res) => res.status(404).send("fail" + JSON.stringify(req.path)) );


server.listen(PORT, () => console.log(`${(new Date().toISOString())} Server is listening on port ${PORT}, (Express + WS)`));