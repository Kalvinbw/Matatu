import React from 'react';
import '../styles/App.css';
import Header from './header';
import PlayerCard from "./playerCard";
import Notification from './Notification';

const WaitingRoom = (props) => {
    const BeginGame = () => {
        props.socket.emit('BeginGame', props.game.name);
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
                    {props.host ? <input type='button' className='button' value='Begin Game' onClick={BeginGame}/> : null}
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;