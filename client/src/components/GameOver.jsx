import '../styles/App.css';
import Header from './header';
import React from 'react';
import Notification from "./Notification";

function GameOver(props) {

    return (
        <div>
            <Header text='Game Over'/>
            <Notification socket={props.socket}/>
            <div className='App-body'>
                <div className='H-stack' style={{backgroundColor: '#222f49', position: 'absolute'}}>
                    {props.players.map((player) => (
                        <div className={player.score === 0 ? 'Hand flipped playable' : 'Hand flipped'}>
                            <h6>{player.name}</h6>
                            <h6>Cards left: {player.cards.length}</h6>
                            <h6>Score: {player.score}</h6>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
    );
}

export default GameOver;