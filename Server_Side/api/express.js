//to delete not needed installation
let express = require("express");
const { createServer } = require("http");
const app = express();
const server = createServer(app);

module.exports = { 
    express, app, server
};