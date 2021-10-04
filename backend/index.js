/********************************************************
 * File: index.js
 * Summary: Server
 * 
 * Listener: Listens for incoming traffic and directs it
 * Socket: Sets up websocket and handles calls
*********************************************************/

// TODO: Add authentication
const listenPort = 8080;
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');
//for the firestore
// const admin = require('firebase-admin');

const {makeDeck} = require('./handlers/deck');
const { addPlayer, getPlayer } = require('./handlers/players');
const {addRoom, removePlayer} = require('./handlers/game');
const doPlay = require('./handlers/playHandler');
const drawCard = require('./handlers/drawCard');

//for the firestore testing
// admin.initializeApp();
  
// const db = admin.firestore();

// async function testSetDB() {
//     const docRef = db.collection('users').doc('alovelace');

//     await docRef.set({
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815
//     });

//     const aTuringRef = db.collection('users').doc('aturing');

//     await aTuringRef.set({
//     'first': 'Alan',
//     'middle': 'Mathison',
//     'last': 'Turing',
//     'born': 1912
//     });index.js

//     const snapshot = await db.collection('users').get();
//     snapshot.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
//     });
// }
// testSetDB();


//begin normal app code
app.use(cors());

app.use(express.static(path.join(__dirname, '/client/build')));

//get the page when they go to the root directory
app.get('/', function(req,res) {
    res.sendFile(path.resolve(__dirname + '/client/build', 'index.html'));
});

//listen on the port the function part is a callback function
let server = app.listen(process.env.PORT || listenPort, function() {
    console.log("listener is active on Port " + listenPort);
});


const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


//Handle Socket connecttions
io.on('connection', (socket) => {
    /* New socket connection */
    socket.on('joinRoom', ({ name, room }, callback) => {
        console.log(`New client connected: ${socket.id}`);
        let Player = addPlayer({id: socket.id, name, room});
        if(Player === "Username is taken.") return callback(Player);
        
        let d = makeDeck();
        let Room = addRoom(Player, room, d);

        socket.join(Room.name);

        io.to(socket.id).emit('playerData', Player);
        io.in(Room.name).emit('roomData', Room);
        let msg = `${Player.name} has joined the game!`;
        notify(Room, msg);

        callback();
    });

    /* on draw card */
    socket.on('drawCard', (p) => {
        //console.log('drawing card');
        //console.log(p);
        let updatedGame = drawCard(p);
        //console.log(updatedGame);
        if(!updatedGame.error) {
            sendData(updatedGame);
            notify(updatedGame, updatedGame.msg);
        } else {
            console.log(updatedGame.error);
        }
    });

    /* on call play */
    socket.on('callPlay', (player) => {
        io.to(player.id).emit('playCalled');
    });

    /* on play data */
    socket.on('playData', (p, hand) => {
        //console.log('play data in server');
        let updatedGame = doPlay(p, hand);
        if(updatedGame.error) {
            console.log(updatedGame.error);
        } else {
            sendData(updatedGame);
            notify(updatedGame, updatedGame.msg);
        }
    });

    /* on begin game */
    socket.on('BeginGame', (gameName) => {
        io.to(gameName).emit('Begin');
    });

    /* on disconnect */
    socket.on('disconnect', () => {
        console.log('a player has disconnected: ' + socket.id);
        let p = getPlayer(socket.id);
        console.log('player to be removed');
        console.log(p.name);
        if(p) {
            let updatedGame = removePlayer(p);
            //console.log(updatedGame.name);
            if(updatedGame.error) {
                console.log('error on disconnect');
                console.log(updatedGame.error);
            } else {
                sendData(updatedGame);
                let msg = `${p.name} has left the game`;
                notify(updatedGame, msg);
            }
        }
    });
});

const sendData = (game) => {
    for(let i = 0; i < game.players.length; i++) {
        io.to(game.players[i].id).emit('playerData', game.players[i]);
    }
    io.in(game.name).emit('roomData', game);
}

// TODO: emit to all except the sender
const notify = (game, msg) => {
    io.in(game.name).emit('notification', msg);
}



module.exports = app;