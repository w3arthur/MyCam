//to delete not needed installation
const express = require("express");
const app = express();
//const router = express.Router();  
//examples here https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express
const { createServer } = require("http");
const WebSocket = require('ws');
const PORT = 5000;
const path = require("path");
const public_folder = 'public_folder';
const getFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);



app.use(require("cookie-parser")());
app.use(express.json({ extended: false }));
app.use(express.urlencoded());

app.get("/", async (req, res) => res.status(200).sendFile(getFile("index.html")) );
app.use("/", express.static(getFile()));  //global public folder
app.route("*").all((req, res) => res.status(404).send("fail" + JSON.stringify(req.path)) );

const server = createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${PORT}, Express + WS`));



const wsServer = new WebSocket.Server({ server , path: "/ws" }) //{port: PORT}
wsServer.on('connection', (socket) => {
    console.log("A client just connected");
    socket.on('message', (msg) => {
        console.log("Received message from client " + msg);

       // wsServer.clients.forEach((client) => {client.send(msg)});

    });
} );

console.log( (new Date()) + "Server is listening on port " + PORT );