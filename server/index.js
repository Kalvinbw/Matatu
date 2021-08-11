//Server file
const listenPort = 8080;
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');

const {makeDeck} = require('./deck');
const { addPlayer, removePlayer, getPlayer, getPlayersInRoom } = require('./players');
const {addRoom, doPlay, drawCard} = require('./game');

//app.use(express.static(path.join(__dirname, '../client/build')));

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

//get the page when they go to the root directory
app.get('/', function(req,res) {
    res.sendFile(path.resolve(__dirname + '../client/build', 'index.html'));
});

// app.get("/getCards", async (req, res) => {
//     let d = makeDeck();
//     res.status(200).json(d);
// });

//listen on the port //the function part is a callback function
let server = app.listen(listenPort, function() {
    console.log("listener is active on Port " + listenPort);
});


const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    //console.log(`New client connected: ${socket.id}`);
    socket.on('joinRoom', ({ name, room }, callback) => {
        let Player = addPlayer({id: socket.id, name, room});
        if(Player === "Username is taken.") return callback(Player);
        
        let d = makeDeck();
        let Room = addRoom(Player, room, d);

        socket.join(Room.name);

        io.to(socket.id).emit('playerData', Player);
        io.in(Room.name).emit('roomData', Room);

        callback();
    });

    socket.on('drawCard', (p) => {
       //console.log('drawing card');
       let updatedGame = drawCard(p);
       for(let i = 0; i < updatedGame.players.length; i++) {
           io.to(updatedGame.players[i].id).emit('playerData', updatedGame.players[i]);
       }
       io.in(updatedGame.name).emit('roomData', updatedGame);
    });

    socket.on('callPlay', (player) => {
        io.to(player.id).emit('playCalled');
    });

    socket.on('playData', (p, hand) => {
        console.log('playdata in server');
        let updatedGame = doPlay(p, hand);
        for(let i = 0; i < updatedGame.players.length; i++) {
            io.to(updatedGame.players[i].id).emit('playerData', updatedGame.players[i]);
        }
        io.to(p.id).emit('playerData', updatedGame.players[p.index]);
        io.in(updatedGame.name).emit('roomData', updatedGame);
    });

    socket.on('disconnect', () => {
        const user = removePlayer(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'Matatu', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getPlayersInRoom(user.room)});
        }
    })
})



module.exports = app;