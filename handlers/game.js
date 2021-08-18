let {makeDeck, shuffleArray} = require('./deck');
let {games, players} = require('../db/db');

const addRoom = (player, roomName, deck) => {
    let d = [...deck];
    let index = games.findIndex((room) => room.name === roomName);
    ////console.log(index);
    
    if(games.length !== 0 && index !== -1) {
        if(games[index].players.length >= 8) {
            return {error: "Room is full"};
        }
    }

    if(index !== -1) {
        player.index = games[index].players.length
        player.cards = games[index].deck.splice(0,4);
        games[index].players.push(player);
        ////console.log(player.cards);
        return games[index];

    } else if(index === -1) {
        player.index = 0;
        let playDeck = d.splice(0,1);
        player.cards = d.splice(0,4);
        player.turn = true;
        ////console.log(playDeck);
        let room = {name: roomName, players: [player], deck: d, playPile: playDeck};
        games.push(room);
        ////console.log(room.playPile);
        return room;
    }
}

const removeRoom = (gameIndex) => {
    console.log('removing room');
    return games.splice(gameIndex, 1)[0];
}

const removePlayer = (player) => {
    let gameIndex = games.findIndex((room) => room.name === player.room);
    if(gameIndex === -1) {return {error: 'Game not found'}}
    let playerIndex = games[gameIndex].players.findIndex(p => p.id === player.id);
    if(playerIndex !== -1) {
        if(player.turn && games[gameIndex].players.length > 1) {
            let nextPlayer = (games[gameIndex].players.length - 1) === player.index ? 0 : player.index + 1;
            games[gameIndex].players[nextPlayer].turn = true;
        }
        let cards = player.cards;
        games[gameIndex].deck.push(...cards);
        games[gameIndex].players.splice(playerIndex, 1);
        if(games[gameIndex].players.length === 0) {
            return removeRoom(gameIndex);
        }
        return games[gameIndex];
    } else {
        return {error: 'Player not found'};
    }
}

function gameOver(game) {
    for(let i = 0; i < game.players.length; i++) {
        if(game.players[i].cards.length === 0) {
            game.gameOver = true;
            break;
        }
    }
    if(!game.gameOver) {
        return game;
    }
    for(let i = 0; i < game.players.length; i++) {
        let score = game.players[i].score;
        for(let j = 0; j < game.players[i].cards.length; j++) {
            score += game.players[i].cards[j].value;
        }
        game.players[i].score = score;
    }
    return game;
}

module.exports = {addRoom, removePlayer, gameOver};