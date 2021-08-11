import './styles/App.css';
import Header from './components/header';
import Hand from './components/Hand';
import Card from './components/Card';
import Begin from './components/Begin';
import GameOver from './components/GameOver';
import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hasBegun: false,
      gameOver: false,
      cards: [],
      playDeck: [],
      players: [
        {cards: [],
        turn: true,
        playCalled: false,
        score: 0},
        {cards: [],
        turn: false,
        playCalled: false,
        score: 0}
      ],
      rooms: []
    }
    this.socket = io('/', {
      withCredentials: true,
    });
    this.shuffleArray = this.shuffleArray.bind(this);
    this.handleDraw = this.handleDraw.bind(this);
    this.callPlay = this.callPlay.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.skipTurn = this.skipTurn.bind(this);
    this.drawExtra = this.drawExtra.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.checkGameOver = this.checkGameOver.bind(this);
    this.checkDeck = this.checkDeck.bind(this);
    this.setGame = this.setGame.bind(this);
  }

  async componentDidMount() {
    await fetch("/getCards")
      .then(res => res.json())
      .then(jsondata => {
        let cards = this.shuffleArray(jsondata);
        let players = [...this.state.players];
        for(let i = 0; i < players.length; i++) {
          players[i].cards = cards.splice(0,4);
        }
        let topCard = cards.splice(0,1);
        this.setState({
          cards: cards,
          players: players,
          playDeck: topCard
        });
      }).catch(e => console.log(e));
    this.configureSocket();
  }

  configureSocket() {
    this.socket.on('connection', (data) => {
      console.log('connection done');
      console.log(data);
      this.setState({
        rooms: data
      })
    });
  }

  shuffleArray(array) {
    //console.log(this.state.cards);
    //let array = this.state.cards;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    //this.setState({cards: array});
    return array;
  }

  handleDraw(card) {
    // get needed variables
    let playerID = 0;
    let cards = this.state.cards.slice();
    let players = [...this.state.players];
    for(let i = 0; i < players.length; i++) {
      if(players[i].turn) {
        playerID = i;
        break;
      }
    }
    let playerCards = players[playerID].cards.slice();

    //add proper card to the hand of the player
    for(let i = 0; i < cards.length; i++) {
      if(cards[i].id === card.id) {
        let c = cards.splice(i, 1);
        playerCards.push(c[0]);
        break;
      }
    }

    for(let i = 0; i < players.length; i++) {
      for(let j = 0; j < players[i].cards.length; j++) {
        players[i].cards[j].canPlay = false;
        players[i].cards[j].selected = false;
      }
    }
    players[playerID].cards = playerCards;

    // change turn to the next player
    let nextTurn = (playerID === players.length - 1) ? 0 : playerID + 1;
    players[nextTurn].turn = !players[nextTurn].turn;
    players[playerID].turn = !players[playerID].turn;

    //set state
    this.setState({
      cards: cards,
      players: players
    });
  }

  callPlay() {
    console.log('play called');
    let players = this.state.players;
    for(let i = 0; i < players.length; i++) {
      if(players[i].turn) {
        players[i].playCalled = !players[i].playCalled;
        //this.setState({players: players});
      }
    }
  }

  handlePlay(playedCards) {
    //console.log('handle play called from app');
    if(!playedCards) {
      this.callPlay();
      return;
    }
    let playerNum;
    let players = [...this.state.players];
    let playPile = [...this.state.playDeck];

    //get the player id who's turn it is
    for(let i = 0; i < players.length; i++) {
      if(players[i].turn) {
        playerNum = i;
        break;
      }
    }

    //set play called to false
    players[playerNum].playCalled = false;

    //loop through played cards and move them from hand to the pile
    let ability;
    for(let i = 0; i < playedCards.length; i++) {
      if(playedCards[i].ability !== false) {ability = true}
      for(let j = 0; j < players[playerNum].cards.length; j++) {
        //push card to play pile if it matches the id given
        if(playedCards[i].id === players[playerNum].cards[j].id) {
          let card = players[playerNum].cards.splice(j, 1);
          playPile.push(card[0]);
        }
      }
    }

    let nextTurn = (playerNum === players.length - 1) ? 0 : playerNum + 1;

    if(ability) {
      this.abilites(playedCards, players, nextTurn);
      this.checkGameOver();
      this.checkDeck();
      return;
    }

     // change turn to the next player
    players[nextTurn].turn = !players[nextTurn].turn;
    players[playerNum].turn = !players[playerNum].turn;

    this.setState({
      playDeck: playPile,
      players: players
    });

    /* TODO: Check if deck is empty and reset it */
    this.checkGameOver();
    this.checkDeck();
  }

  abilites(cards, players, id) {
    /* TODO: handle 8 cards */
    console.log(cards[0].ability)
    switch(cards[0].ability) {
      case 'Draw 2':
        this.drawExtra(players, 2, id, cards);
        break;
      case 'Draw 4':
        this.drawExtra(players, 4, id, cards);
        break;
      case 'Draw 5':
        this.drawExtra(players, 5, id, cards);
        break;
      case 'Skip Turn':
        this.skipTurn(cards, players);
        break;
      // case 'Wild':
      //   this.wildCard(cards, players, id);
      //   break;
      default:
        return -1;
    }
  }

  // wildCard(cards, players, id) {
  //   let prevId = id === 0 ? players.length - 1 : id--;
  //   let hand = players[prevId].cards;
  //   let options = {
  //     suits: ['Heart', 'Diamond', 'Spade', 'Club'],
  //     numbers: [1,2,3,4,5,6,7,9,10,11,12,13]
  //   }
  //   let yourOptions = [];

  //   for(let i = 0; i < hand.length; i++) {
  //     if(hand[i].suit in options.suits) {
  //       if(!(hand[i].suit in yourOptions)) {
  //         yourOptions.push(hand[i].suit)
  //       }
  //     }

  //     if(hand[i].number in options.numbers) {
  //       if(!(hand[i].number in yourOptions)) {
  //         yourOptions.push(hand[i].number)
  //       }
  //     }
  //   }

  //   players[id].turn

  // }

  drawExtra(players, drawAmount, nextid, cards) {
    //init variables
    let deck = [...this.state.cards];
    let play = [...this.state.playDeck];

    //loop over deck and add them to other players hand
    for(let i = 0; i < cards.length; i++) {
      let extra = deck.splice(0, drawAmount);
      players[nextid].cards.push(...extra);
    }

    //add selected cards to play pile
    play.push(...cards);

    //set state
    this.setState({
      cards: deck,
      playDeck: play,
      players: players
    })
  }

  skipTurn(cards, players) {
    let play = [...this.state.playDeck];
    play.push(...cards);

    this.setState({
      playDeck: play,
      players: players
    })

  }

  startGame() {
    this.setState({hasBegun: true});
  }

  checkGameOver() {
    for(let i = 0; i < this.state.players.length; i++) {
      if(this.state.players[i].cards.length === 0) {
        this.endGame();
      }
    }
  }

  checkDeck() {
    let deck = [...this.state.cards];
    let playPile = [...this.state.playDeck];

    if(deck.length === 0) {
      let topCard = playPile.pop();
      this.setState({
        playDeck: topCard,
        cards: playPile
      });
    }
  }

  endGame() {
    let players = this.state.players;

    for(let i = 0; i < players.length; i++) {
      let score = 0;
      for(let j = 0; j < players[i].cards; i++) {
        score += players[i].cards[j].value;
      }
      players[i].score = score;
      players[i].id = i + 1;
    }

    this.setState({
      gameOver: true,
      players: players
    });
  }

  setGame(username, room) {
    this.setState({
      username: username,
      room: room
    });
    this.socket.emit('joinRoom', username, room);
  }

  //Send to non turn person so that they can't click cards
  doNothing() {}

  render () {
    // if(!this.state.hasBegun) {
    //   return <Begin handleClick={this.startGame} action={this.setGame} rooms={this.state.rooms}/>
    // }

    if(this.state.gameOver) {
      return <GameOver players={this.state.players}/>
    }

    let DoneLoading = (this.state.cards.length > 0)

    return (
      <div>
        <Header />

        <div className='App-body'>
          <Hand id={1} player={this.state.players[1]} 
          topCard={this.state.playDeck[this.state.playDeck.length - 1]}
          action={this.state.players[1].turn ? 
            this.handlePlay : this.doNothing}/>

          <div className='H-stack'>

            {DoneLoading ? null : <p>Loaddecking Game</p>}

            <div className='Deck' id='drawPile'>             
              {this.state.cards.map((card) => (
                <Card key={card.id} show={false} card={card}
                className='Card' handleChange={this.handleDraw}/>
              ))}
            </div>

            <div className='Deck' id='playPile'>
              {this.state.playDeck.map((p) => (
                <Card key={p.id} show={true} card={p}
                className='Card' handleChange={this.doNothing}/>
                ))}
            </div>

            <p className={this.state.players[0].turn ? 'App-link' : null}>
              {DoneLoading ? this.state.players[0].turn ? 'Your Turn' : "Opponent's Turn" : null}
            </p>

            {DoneLoading ? <input type='button' onClick={this.callPlay} value='Play Selected Card(s)'/> : null}
          </div>

          <Hand id={0} player={this.state.players[0]} 
          topCard={this.state.playDeck[this.state.playDeck.length - 1]}
          action={this.state.players[0].turn ? 
            this.handlePlay : this.doNothing}/>

        </div>

      </div>
      
    );
  }
}

export default App;
