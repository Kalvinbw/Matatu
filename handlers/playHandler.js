/********************************************************
 * File: playHandler.js
 * Summary: Handles a play call
*********************************************************/

const {addRoom, removePlayer, gameOver} = require("./game");
let {games, players} = require('../db/db');
const numToWords = require('num-to-words');
const {shuffleArray} = require('./deck');



/***********************************************************************
 * Function: doPlay
 * Description: Takes the played card and handles them. Moves to 
 *              playPile, and changes turn
 * 
 * @param player - required - The player who played the cards
 * @param hand - required - The cards in the players hand
 * 
 * @return - game with new info
************************************************************************/
const doPlay = (player, hand) => {
    //find the game
    let gameIndex = games.findIndex((room) => room.name === player.room);
    if(gameIndex === -1) {return {error: 'Game not found'}}
    //filter out the selected cards
    let selectedCards = hand.filter(c => c.selected);
    let notifyCard = selectedCards[0];
    let ability = false;
    for(let i = 0; i < selectedCards.length; i++) {
        ability = selectedCards[i].ability !== false;
        for(let j = 0; j < hand.length; j++) {
            hand[j].canPlay = false;
            hand[j].selected = false;
            if(selectedCards[i].id === hand[j].id) {
                let c = hand.splice(j,1);
                //push the selected cards to the play pile
                games[gameIndex].playPile.push(c[0]);
            }
        }
    }
    //give the hand to the player
    player.cards = hand;
    games[gameIndex].players[player.index] = player;
    if(ability) {
        let g = handleAbility(player, games[gameIndex], selectedCards);
        g = gameOver(g);
        return g;
    } else {
        player.turn = !player.turn;
        let nextPlayer = (games[gameIndex].players.length - 1) === player.index ? 0 : player.index + 1;
        games[gameIndex].players[nextPlayer].turn = true;
    }
    games[gameIndex].msg = `${player.name} played ${numToWords.numToWords(selectedCards.length)} ${notifyCard.number > 10 ? notifyCard.name : notifyCard.ability ? notifyCard.name : notifyCard.number}${selectedCards.length > 1 ? 's' : ''}`;
    games[gameIndex] = gameOver(games[gameIndex]);
    return games[gameIndex];
}


/***********************************************************************
 * Function: handleAbility
 * Description: Sends card info to correct function to handle ability
 * 
 * @param player - required - The player who played the cards
 * @param game - required - The current game info
 * @param cards - required - The cards played by player
 * 
 * @return - game with updated info
************************************************************************/
const handleAbility = (player, game, cards) => {
    let g = game;
    switch(cards[0].ability) {
        case 'Draw 2':
          g = drawExtra(player, game, 2, cards);
          break;
        case 'Draw 4':
          g = drawExtra(player, game, 4, cards);
          break;
        case 'Draw 5':
          g = drawExtra(player, game, 5, cards);
          break;
        case 'Skip Turn':
          g = skipTurn(player, game, cards);
          break;
        // case 'Wild':
        //   this.wildCard(cards, players, id);
        //   break;
        default:
          return -1;
    }
    return g;
}


/***********************************************************************
 * Function: drawExtra
 * Description: draws extra cards and puts them in hand of next player
 * 
 * @param player - required - The player who played the cards
 * @param game - required - The current game info
 * @param drawAmount - required - The amount to be drawn
 *                  (2: two cards, 10: four cards, joker: five cards)
 * @param cards - required - the cards played by player
 * 
 * @return - game with updated info
************************************************************************/
function drawExtra(player, game, drawAmount, cards) {
    let nextPlayer = (game.players.length - 1) === player.index ? 0 : player.index + 1;
    if(game.deck.length <= (drawAmount * cards.length)) {
        let shuffleCards = game.playPile.splice(0, game.playPile.length - 2);
        shuffleCards = shuffleArray(shuffleCards);
        game.deck.unshift(...shuffleCards);
    }

    let extra = game.deck.splice(0, (drawAmount * cards.length));
    game.players[nextPlayer].cards.push(...extra);

    game.players[player.index].turn = false;
    if(game.players.length > 2) {
        if((game.players.length - 1) === player.index) {
            nextPlayer = 1;
        } else if((game.players.length - 2) === player.index) {
            nextPlayer = 0;
        } else {
            nextPlayer = player.index + 2;
        }
    } else {
        nextPlayer = player.index;
    }
    game.players[nextPlayer].turn = true;
    let l = numToWords.numToWords(cards.length);
    game.msg = `${player.name} played ${l} ${cards[0].number > 10 ? cards[0].name : cards[0].ability ? cards[0].name : cards[0].number}${cards.length > 1 ? 's' : ''}`;
    return game
}


/***********************************************************************
 * Function: skipTurn
 * Description: skips players based on how many skip cards were played
 * 
 * @param player - required - The player who played the cards
 * @param game - required - The current game info
 * @param cards - required - the cards played by player
 * 
 * @return - game with updated info
************************************************************************/
function skipTurn(player, game, cards) {
    if(game.players.length <= 2) {
        game.msg = `${player.name} played ${numToWords.numToWords(cards.length)} Ace${cards.length > 1 ? 's' : ''}`;
        return game;
    }

    let nextPlayer;
    for(let i = 0; i < cards.length; i++) {
        if((game.players.length - 1) === player.index) {
            nextPlayer = 1;
        } else if((game.players.length - 2) === player.index) {
            nextPlayer = 0;
        } else {
            nextPlayer = player.index + 2;
        }
    }

    game.players[player.index].turn = false;
    game.players[nextPlayer].turn = true;
    game.msg = `${player.name} played ${numToWords.numToWords(cards.length)} Ace${cards.length > 1 ? 's' : ''}`;
    return game;
}

module.exports = doPlay;