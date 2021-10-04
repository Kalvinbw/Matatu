/********************************************************
 * File: players.js
 * Summary: Creates players and retrievs player info
*********************************************************/

let {players} = require('../db/db');



/***********************************************************************
 * Function: addPlayer
 * Description: Creates a new player
 * 
 * @param id - required - The socket id
 * @param name - required - The name of the player
 * @param room - required - The name of the room to be joined
 * 
 * @return - New player
************************************************************************/
const addPlayer = ({id, name, room}) => {
    //let existingPlayer = players.find((player) => player.room === room && player.name === name);
    if(!name || !room) return {error: "Username and room are required."};
    //if(existingPlayer) return "Username is taken.";

    let player = {id, name, room};
    player.turn = false;
    player.score = 0;

    players.push(player);

    return player;
}


/***********************************************************************
 * Function: getPlayer
 * Description: retrieves player from socket id
 * 
 * @param id - required - The socket id
 * 
 * @return - player
************************************************************************/
const getPlayer = (id) => players.find((player) => player.id === id);

module.exports = { addPlayer, getPlayer };