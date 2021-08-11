import '../styles/App.css';
import Header from './header';
import React from 'react';
// TODO: Design endgame to show winner on top
function GameOver(props) {
    console.log(props.players);
    return (
        <div>
            <Header />
            <div className='App-body'>
                <div>
                    <p className='App-link'>
                        Thanks for playing!
                    </p>
                    <ul> Scores
                        {props.players.map((player) => (
                            <li>{player.name}: {player.score}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        
    );
}

export default GameOver;