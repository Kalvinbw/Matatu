import './styles/App.css';
import Header from './components/header';
import Hand from './components/NewHand';
import Card from './components/Card';
//import GameOver from './components/GameOver';
import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import GameOver from "./components/GameOver";

// TODO: End game and calculate winner
// TODO: Handle one card left (going out)
// TODO: Handle 8 card
// TODO: Handle adding another draw extra card if you have one in hand
// TODO: handle max amount of players in a game (or add more to deck)
// TODO: handle waiting room and room creator
// TODO: handle disconnect and reconnect
// TODO: handle removing room and players when exit
// TODO: handle player leaving room during game

let socket;

const NewApp = ({ location }, props) => {
    const [player, setPlayer] = useState('');
    const [game, setGame] = useState({});
    
    let ENDPOINT = '/';

    //handle joining the game room
    useEffect(() => {
        console.log(location);
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, {
            withCredentials: true,
        });

        socket.emit('joinRoom', {name, room}, (error) => {
            console.log('emit join room');
            if(error) {
                alert(error);
                props.history.push('/');
            }
        });
    }, [ENDPOINT, location.search]);

    //handle update data calls
    useEffect(() => {
        socket.on('roomData', (room) => {
            console.log('new room data received');
            setGame(room);
        });

        return () => {
            socket.off('roomData');
        }
    }, [game]);

    //handle player data
    useEffect(() => {
        socket.on('playerData', (player) => {
            setPlayer(player);
        });

        return () => {
            socket.off('playerData');
        }
    }, [player]);

    //Send a request to call a play
    const callPlay = () => {
        socket.emit('callPlay', player);
    }

    //send the data to socket
    const sendPlayData = (cards) => {
        socket.emit('playData', player, cards);
    }

    //send data to draw a card
    const drawCard = () => {
        socket.emit('drawCard', player);
    }

    //render this if not loaded yet
    if(!game.players) {
        return (
            <div>
                <Header text='Matatu!'/>
                <div className='App-body'>
                    <p>Connecting to server</p>
                </div>
            </div>
        )
    }

    if(game.gameOver) {
        return <GameOver players={game.players}/>;
    }

    return (
        <div>
            <Header text={`Welcome to ${game.name}, ${player.name}`}/>
            <div className='App-body'>
                <div className='H-stack' style={{backgroundColor: '#222f49'}}>
                    <div>
                        <p>Players in {game.name}</p>
                        <ul>
                            {game.players.map((p) => (
                                <li key={p.name}>{p.name}</li>
                            ))}
                        </ul>
                    </div>
                    
                </div>
                <div className='H-stack'>
                    <div className='Deck' id='drawPile'>             
                    {game.deck.map((card) => (
                        <Card key={card.id} show={true} card={card}
                        className='Card' handleChange={drawCard}/>
                    ))}
                    </div>

                    <div className='Deck' id='drawPile'>             
                    {game.playPile.map((card) => (
                        <Card key={card.id} show={true} card={card}
                        className='Card' handleChange={drawCard}/>
                    ))}
                    </div>

                    <p className={player.turn ? 'App-link' : null}>
                        {player.turn ? `Your Turn` : `Opponent's Turn`}
                    </p>

                    <input type='button' onClick={player.turn ? callPlay : null} value='Play Selected Card(s)'/>
                </div>
                <Hand player={player} 
                socket={socket}
                topCard={game.playPile[game.playPile.length - 1]}
                handlePlay={sendPlayData}/>
            </div>
        </div>
        
    );
}

export default NewApp;
