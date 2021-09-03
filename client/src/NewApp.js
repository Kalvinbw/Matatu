import './styles/App.css';
import Header from './components/header';
import Hand from './components/NewHand';
import Card from './components/Card';
import Notification from './components/Notification';
//import Rules from './components/rules';
import React, {useEffect, useState} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import GameOver from "./components/GameOver";
import PlayerCard from "./components/playerCard";
import WaitingRoom from './components/WaitingRoom';

// TODO: Handle one card left (going out)
// TODO: Handle 8 card
// TODO: Handle adding another draw extra card if you have one in hand
// TODO: let room set final score and play games until reached (add score each round);
// TODO: end game right away and total scores
// TODO: fix skip card
// TODO: make the discard pile messy

// TODO: handle max amount of players in a game (or add more to deck)
// TODO: handle disconnect and reconnect
// TODO: add message feature
// TODO: handle people leaving and then joining again mid game and it not letting them in
// TODO: handle letting single player play after everyone leaves


let socket;

const NewApp = ({ location }) => {
    const [player, setPlayer] = useState('');
    const [game, setGame] = useState({});
    const [begin, setBegin] = useState(false);
   
    
    let ENDPOINT = '/';

    //handle joining the game room
    useEffect(() => {
        //console.log(location);
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, {
            withCredentials: true,
        });

        socket.emit('joinRoom', {name, room}, (error) => {
            //console.log('emit join room');
            if(error) {
                alert(error);
            }
        });

        return () => {
            //console.log('about to disconnect');
            socket.disconnect();
        }
    }, [ENDPOINT, location.search]);

    //handle update data calls
    useEffect(() => {
        socket.on('roomData', (room) => {
            //console.log('new room data received');
            //console.log(room);
            setGame(room);
        });

        return () => {
            socket.off('roomData');
        }
    }, [game]);

    //handle player data
    useEffect(() => {
        socket.on('playerData', (player) => {
            //console.log('new player data received');
            if(player.sort) {
                sortCards();
            }
            setPlayer(player);
        });

        return () => {
            socket.off('playerData');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player]);

    useEffect(() => {
        socket.on('Begin', () => {
            //console.log('new player data received');
            setBegin(true);
        });

        return () => {
            socket.off('Begin');
        }
    }, [begin]);



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
        // console.log('drawing card');
        // console.log(player);
        socket.emit('drawCard', player);
    }

    const sortCards = () => {
        //console.log('called sortCards');
        let cards = [...player.cards];
        //console.log(cards);
        for(let i = 0; i < cards.length; i++) {
            for(let j = i + 1; j < cards.length; j++) {
                let temp;
                if(cards[i].number > cards[j].number) {
                    temp = cards[i];
                    cards[i] = cards[j];
                    cards[j] = temp;
                }
            }
        }
        //console.log(cards);
        player.cards = cards;
        setPlayer({...player});
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
    } else if(game.players.length > 0 && !begin) {
        return (
            <WaitingRoom socket={socket}
                host={player.host ? true : false}
                game={game}
            />
        );
    }

    if(game.gameOver) {
        return <GameOver players={game.players} socket={socket}/>;
    }

    return (
        <div>
            <Header text={`Welcome to ${game.name}, ${player.name}`}/>
            <Notification socket={socket}/>
            <div className='App-body'>
                <div className='H-stack' style={{backgroundColor: '#222f49'}}>
                    {game.players.map((p) => (
                        <PlayerCard key={p.id} player={p} className='Hand'/>
                    ))}
                </div>
                <div className='H-stack'>
                    <div className='Deck' id='drawPile'>             
                    {game.deck.map((card) => (
                        <Card key={card.id} show={false} card={card}
                        className='Card' handleChange={player.turn ? drawCard : () => null}/>
                    ))}
                    </div>

                    <div className='Deck' id='drawPile'>             
                    {game.playPile.map((card) => (
                        <Card key={card.id} show={true} card={card}
                        className='Card' handleChange={() => null}/>
                    ))}
                    </div>

                    <div style={{display: 'flex',flexDirection: 'column'}}>
                        <input type='button' onClick={player.turn ? callPlay : null} 
                            value='Play Selected Card(s)' className='button'/>
                        <input type='button' onClick={sortCards} value='Sort Cards' 
                            className='button'/>
                    </div>

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
