const path = require('path');
const PORT = 3777;
const WS_PATH_1 = '/ws_arduino';
const WS_PATH_1_APPROVAL_MESSAGE = 'desktopApplication';    // if receive another one will not include to ws clients list
const API_TURNON_LED_RETURN = '1';
const public_folder = 'public_folder';
const SECRET_KEY = 'secretKey';
const ARDUINO_VALUE_MAX_LENGTH = 20;
const COMMENT_VALUE_MAX_LENGTH = 255;
const LAST_COMMENT_RETURN = 7;
const LAST_DISPLAY_TEXT_RETURN = 7;
const MONGO_DB_CONNECTION_STRING = 'mongodb://localhost:27017/' + 'ArthurCam'; //'mongodb+srv://legopart:WfHIGKcxMGsllNS4@cluster0.uwlwx.mongodb.net/' + 'ArthurCam';

const getLocalFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);

const webSocketBroadcast = (clients, message) => {
    try{ if(!clients || clients.size == 0) throw new Error();
        clients.forEach((client) => { if (client.readyState === WebSocket.OPEN)  client.send(message); });
        return true;
    } catch {return false;}
}

//mongodb
const mongoose = require("mongoose");
function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {  useNewUrlParser: true, useUnifiedTopology: true, });
    db.on('error', function (error) { console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`); db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`)); });
    db.on('connected', function () { console.log(`MongoDB :: connected ${this.name}`); /* mongoose.set('debug', function (col, method, query, doc) { console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`); });*/ });
    db.on('disconnected', function () { console.log(`MongoDB :: disconnected ${this.name}`); });
    return db;
}
const mongoose1 = makeNewConnection(MONGO_DB_CONNECTION_STRING);
//Schemes
const MessageSchema =  new mongoose.Schema({message: {type: String, index: false}, createdAt: {type: Date, index: -1}, }, { timestamps: true, });
//module and validator
const CommentModel = mongoose1.model( "Comment", MessageSchema ); //comments
const DisplayTextModel = mongoose1.model( "Display_String" , MessageSchema );  //display_strings



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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//http:
app.use("/", express.static(getLocalFile()));  //global public folder
app.route("/").get(async (req, res) => res.status(200).sendFile(getLocalFile("index.html")) );
app.route("/test").get(async (req, res) => {
    //await CommentModel( {message : 'test2'} ).save();
    //await DisplayTextModel( {message : 'test2'} ).save();
    return res.status(200).sendFile(getLocalFile("test.html")) 
});

app.route("/api/rtmp_auth").post(async (req, res) => {
    const streamKey = req.body.key;
    if (streamKey === SECRET_KEY) {return res.status(200).send(); } // You can make a database of users instead :) 
    else return res.status(403).send(); //Reject the stream
} );

app.route("/api/arduino/:param").get(async (req, res) => { try{
        const {param} = req.params;
        if (param.length > ARDUINO_VALUE_MAX_LENGTH) param = param.substring(0, ARDUINO_VALUE_MAX_LENGTH);
        if (param.trim().length === 0) throw new Error();
        const result = webSocketBroadcast(req.app.locals.clients1, param);   ///api/arduino requested, turn on the lamp
        console.log('arduino requested ' + (result ? 'sent' : 'not sent!'));
        if(!result) throw new Error();
        //is a string
        if(param.length !== 1){
            const data1 = {message: param};
            DisplayTextModel(data1).save();
        }
        const data2 = {arduino: true};
        return res.status(200).json( data2 );
    } catch(e){ return res.status(400).send('cant send a message to arduino'); }
} );

app.route("/api/strings").get(async (req, res) => { try{
        const data = {};
        const sort = {createdAt: -1};
        const result = await DisplayTextModel.find(data).sort( sort ).limit( LAST_DISPLAY_TEXT_RETURN ).skip(0).select('message -_id');
        const arrayResult = result.map(x => x.message);
        const returnResult = {displayText: arrayResult};
        return res.status(200).json(returnResult);
    } catch(e){ return res.status(400).send('fail to get the display text strings'); }
} );

app.route("/api/comments")
.get(async (req, res) => { try{
        const data = {};
        const sort = {createdAt: -1};
        const result = await CommentModel.find(data).sort( sort ).limit( LAST_COMMENT_RETURN ).skip(0).select('message -_id');
        const arrayResult = result.map(x => x.message);
        const returnResult = {comments: arrayResult};
        return res.status(200).json(returnResult);
    } catch(e){ return res.status(400).send('fail to get the comments'); }
} )
.post(async (req, res) => { try{
        const {message} = req.body;
        let messageTrim = message;
        if (messageTrim.length > ARDUINO_VALUE_MAX_LENGTH) messageTrim = messageTrim.substring(0, COMMENT_VALUE_MAX_LENGTH);
        if (messageTrim.trim().length === 0) throw new Error();
        const data = {message: messageTrim};
        const result = await CommentModel( data ).save();
        return res.status(200).json(result);
    } catch(e){ return res.status(400).send('fail to post a comment'); }
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


