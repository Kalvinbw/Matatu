//Server file
const listenPort = 8080;
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');

const {makeDeck} = require('./deck');
const { addPlayer, getPlayer } = require('./players');
const {addRoom, doPlay, drawCard, removePlayer} = require('./game');

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
    ////console.log(`New client connected: ${socket.id}`);
    socket.on('joinRoom', ({ name, room }, callback) => {
        console.log(`New client connected: ${socket.id}`);
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
        //console.log(p);
        let updatedGame = drawCard(p);
        //console.log(updatedGame);
        if(!updatedGame.error) {
            sendData(updatedGame);
        } else {
            console.log(updatedGame.error);
        }
    });

    socket.on('callPlay', (player) => {
        io.to(player.id).emit('playCalled');
    });

    socket.on('playData', (p, hand) => {
        //console.log('play data in server');
        let updatedGame = doPlay(p, hand);
        sendData(updatedGame);
    });

    socket.on('disconnect', () => {
        console.log('a player has disconnected: ' + socket.id);
        let p = getPlayer(socket.id);
        if(p) {
            let updatedGame = removePlayer(p);
            //console.log(updatedGame.name);
            if(updatedGame.error) {
                //console.log('error on disconenct');
            } else {
                sendData(updatedGame);
            }
        }
    });
});

const sendData = (game) => {
    for(let i = 0; i < game.players.length; i++) {
        io.to(game.players[i].id).emit('playerData', game.players[i]);
    }
    io.in(game.name).emit('roomData', game);
    io.in(game.name).emit('notification', game.msg);
}



module.exports = app;