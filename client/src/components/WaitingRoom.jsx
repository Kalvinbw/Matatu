import React from 'react';
import '../styles/App.css';
import Header from './header';
import PlayerCard from "./playerCard";
import Notification from './Notification';

const WaitingRoom = (props) => {
    const BeginGame = () => {
        props.socket.emit('BeginGame', props.game.name);
    }

    let button;
    if(props.host) {
        if(props.game.players.length < 2) {
            button = <p>Waiting for other players</p>
        } else {
            button = <input type='button' className='button' value='Begin Game' onClick={BeginGame}/>
        }
    } else {
        button = <p>Waiting for host to begin game</p>
    }

    return (
        <div>
            <Header text={`${props.game.name} Waiting Room`}></Header>
            <Notification socket={props.socket}/>
            <div className='App-body'>
                <div className='H-stack'>
                    {props.game.players.map(p => (
                        <PlayerCard key={p.id} player={p} className='Hand'/>
                    ))}
                </div>
                <div>
                    {button}
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;