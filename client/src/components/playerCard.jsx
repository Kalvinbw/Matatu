import React from 'react';

function PlayerCard(props) {
    let myClass = props.className;
    myClass = myClass + ' flipped';
    if(props.player.turn) {
        myClass = myClass + ' selected';
    }
    return (
        <div className={myClass}>
            <h6>Player: {props.player.index + 1}</h6>
            <h6>{props.player.name}</h6>
            <h6>Cards: {props.player.cards.length}</h6>
        </div>
    );
}

export default PlayerCard;