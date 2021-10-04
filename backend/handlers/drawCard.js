/********************************************************
 * File: drawCard.js
 * Summary: Handles a player drawing a card
*********************************************************/

const {addRoom, removePlayer, gameOver} = require("./game");
let {games, players} = require('../db/db');



/***********************************************************************
 * Function: drawCard
 * Description: Draws a card from the play pile and changes turn to 
 *              next player
 * 
 * @param player - required - The player info that wants to draw
 * 
 * @return - game info after turn change
************************************************************************/
const drawCard = (player) => {
    if(!player) {return {error: 'no player data received'}}
    //console.log('draw card');
    let gameIndex = games.findIndex((room) => room.name === player.room);

    //console.log(games[gameIndex]);
    if(games[gameIndex].deck.length <= 1) {
        let shuffleCards = games[gameIndex].playPile.splice(0, games[gameIndex].playPile.length - 2);
        //console.log(shuffleCards);
        shuffleCards = shuffleArray(shuffleCards);
        //console.log(shuffleCards);
        games[gameIndex].deck.unshift(...shuffleCards);
    }

    let c = games[gameIndex].deck.splice(games[gameIndex].deck.length - 1, 1);
    player.cards.push(c[0]);
    player.turn = false;
    games[gameIndex].players[player.index] = player;
    let nextPlayer = (games[gameIndex].players.length - 1) === player.index ? 0 : player.index + 1;
    games[gameIndex].players[nextPlayer].turn = true;
    games[gameIndex] = gameOver(games[gameIndex]);
    games[gameIndex].msg = `${player.name} drew a card`;
    return games[gameIndex];

}

module.exports = drawCard;