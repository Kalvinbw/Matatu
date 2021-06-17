//Server
//Declare variables
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let sockets = [];

//Set up routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/waitingRoom', (req,res) => {
    res.sendFile(__dirname + '/waitingRoom.html');
});


//Socket logic
io.on('connection', (socket) => {
    sockets.push(socket.id);
    io.emit('update sockets', users);

    socket.on('disconnect', () => {
        users = users.filter(user => user !== socket.id);
        console.log(users);
        io.emit('update users', users);
    });
  });


//Listener
server.listen(3000, () => {
  console.log('listening on: 3000');
});