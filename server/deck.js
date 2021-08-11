class Card {
    constructor(ID, sui, nam, num, abil, v) {
        this.id = ID;
        this.suit = sui;
        this.name = nam;
        this.number = num;
        this.ability = abil;
        this.value = v;
        this.canPlay = false;
        this.selected = false;
    }
}

class Deck {
    constructor(cardArray) {
        this.cards = cardArray;
        this.discardPile = [];
        this.drawPile = [];
    }

    discard(c) {
        for (let i = 0; i < c.length; i++) {
            this.discardPile.push(c[i]);
            this.cards.splice();
        }
    }
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    //this.setState({cards: array});
    return array;
}

const makeDeck = () => {
    let suits = ['Heart', 'Spade', 'Club', 'Diamond'];
    let names = ['Ace', 'Jack', 'Queen', 'King', 'Joker'];
    let ability = ['Draw 2', 'Draw 4', 'Draw 5', 'Skip Turn', 'Wild'];
    let values = [25, 50, 100];

    let cardAr = [];
    //create all the cards
    for(let i=0; i<suits.length; i++) {
        let sui = suits[i];
        let num;
        let val;
        let abil;
        let nam;
        for(let j=1; j<14; j++) {
            let ID = "" + i + j;
            num = j;
            switch(num) {
                case 1:
                    nam = names[0];
                    val = values[0];
                    abil = ability[3];
                    break;
                case 2:
                    nam = num;
                    val = num;
                    abil = ability[0];
                    break;
                case 8:
                    nam = num;
                    val = values[1];
                    abil = false;
                    break;
                case 10:
                    nam = num;
                    val = num;
                    abil = ability[1];
                    break;
                case 11:
                    nam = names[1];
                    val = 10;
                    abil = false;
                    break;
                case 12:
                    nam = names[2];
                    val = 10;
                    abil = false;
                    break;
                case 13:
                    nam = names[3];
                    val = 100;
                    abil = false;
                    break;
                default:
                    nam = num;
                    val = num;
                    abil = false;
            } //end switch
            let c = new Card(ID, sui, nam, num, abil, val);
            cardAr.push(c);
        }
    }

    //create the joker cards
    for(let i = 0; i < 2; i++) {
        let c = new Card(i, 'Joker', names[4], 0, ability[2], values[2]);
        cardAr.push(c);
    }
    let shuff = shuffleArray(cardAr)
    return cardAr;
}

module.exports = {makeDeck, shuffleArray};