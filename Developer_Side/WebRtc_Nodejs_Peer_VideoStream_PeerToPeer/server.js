// npm i -g peer
// peerjs --port 3001
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/', (req, res) => {
  return res.render('room', { });
})

app.get('/webcam-set', (req, res) => {
  return res.render('webcam-set', {  });
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    })
  })
})


server.listen(3000);