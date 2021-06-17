const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

//Card Class
class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }
    ability;
}

//Deck Class
class Deck {
    constructor() {
        this.cards = [];    
    }
                       
    createDeck() {
        let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        let ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                this.cards.push(new Card(suits[i], ranks[j], values[j]));
            }
        }

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].value === 1 || this.cards[i].value === 2 ||
                this.cards[i].value === 8 || this.cards[i].value === 10) 
            {
                let x = this.cards[i].value;
                switch (x) {
                    case 1:
                        this.cards[i].ability = 'skip';
                        break;
                    case 2:
                        this.cards[i].ability = 'Draw Two';
                        break;
                    case 8:
                        this.cards[i].ability = 'Wild Card';
                        break;
                    case 10:
                        this.cards[i].ability = 'Draw Four';
                        break;
                }
            }
        }
    }
    shuffleDeck() {
        let location1, location2, tmp;
        for (let i = 0; i < 1000; i++) {
            location1 = Math.floor((Math.random() * this.cards.length));
            location2 = Math.floor((Math.random() * this.cards.length));
            tmp = this.cards[location1];
            this.cards[location1] = this.cards[location2];
            this.cards[location2] = tmp;
        }
    }
}

//Player Class
class Player {
    constructor(id) {
        this.id = id;
        this.playerCards = [];
    }
    name;

    updateName(n) {
        this.name = n;
    }
}

//Game Board Class
class Board {
    constructor() {
        this.cardsInMiddle = [];
        this.players = [];
    }
    start(playerOneId, playerTwoId) {
        this.players.push(new Player(playerOneId));
        this.players.push(new Player(playerTwoId));
        let d = new Deck();
        d.createDeck();
        d.shuffleDeck();    
        this.players[0].playerCards = d.cards.slice(0, 26);
        this.players[1].playerCards = d.cards.slice(26, 52);
    }
}


// let gameBoard = new Board();
// gameBoard.start('Mario', 'Luigi');
// console.log(gameBoard.players);

