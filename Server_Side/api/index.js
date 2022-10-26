const mongoDB = require('./mongoDB');
const localFiles = require('./localFiles');
const webSocket = require('./webSocket');
const express = require('./express');

module.exports = { 
    mongoDB, localFiles, webSocket, express
};