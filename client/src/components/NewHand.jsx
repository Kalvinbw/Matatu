import '../styles/App.css';
import React, {useState, useEffect} from 'react';
import Card from './Card';

const Hand = (props) => {
    const [hand, setHand] = useState([]);

    //update playable cards on turn
    useEffect(() => {
        let hand = props.player.cards;
        //console.log('use effect called');
        let tc = props.topCard;
        if(props.player.turn) {
            let h = checkCanPlay(hand, tc);
            setHand(h);
        } else {
            let h = hand.map(c => {
                c.canPlay = false;
                c.selected = false;
                return c;
            });
            setHand(h);
        }

    }, [props, props.player, props.player.cards, props.player.turn, props.topCard, props.topCard.number, props.topCard.suit]);

    useEffect(() => {
        props.socket.on('playCalled', () => {
            props.handlePlay(hand);
        });

        return () => {
            props.socket.off('playCalled');
        }
    });

    const handleSelect = (card) => {
        //Sanity Check
        if(!card.canPlay) {
            alert('This card is not playable');
            return;
        }

        let handCopy = [...hand];
        let match = false
        for(let i = 0; i < handCopy.length; i++) {
            //if they chose a selected card, unselect it
            if(card.id === handCopy[i].id && handCopy[i].selected) {
                handCopy[i].selected = !handCopy[i].selected;
                let hc;
                let selectedCard = -1;
                for(let j=0;j<handCopy.length;j++) {
                    if(handCopy[j].selected) {
                        selectedCard = j;
                        break;
                    }
                }
                if(selectedCard > -1) {
                    hc = checkNumberMatch(handCopy, handCopy[selectedCard].number);
                    setHand(hc);
                } else {
                    hc = checkCanPlay(handCopy, props.topCard);
                    setHand(hc);
                }
                match = true;
                break;
            } 
            //if they chose a playable card
            else if(card.id === handCopy[i].id && handCopy[i].canPlay) {
                //select the card
                handCopy[i].selected = !handCopy[i].selected;
                let hc = checkNumberMatch(handCopy, card.number);
                setHand(hc);
                match = true;
                break;
            } 
        }
        if(!match) {
            alert("Sorry you can't play that card!");
        }
    }

    const checkCanPlay = (array, checkCard) => {
        // console.log('check card');
        // console.log(array);
        // console.log(checkCard);
        //if joker is on top, any card is playable
        let ar = [...array];
        if(checkCard.number === 0) {
            for(let i = 0; i < ar.length; i++) {
                ar[i].canPlay = true;
            }
            return ar;
        }

        //check which cards are playable
        for(let i = 0; i < ar.length; i++) {
            if(ar[i].suit === checkCard.suit ||
                ar[i].number === checkCard.number ||
                ar[i].number === 8 || ar[i].number === 0) {
                    ar[i].canPlay = true;
            } else {
                ar[i].canPlay = false;
            }
        }

        return ar;
    }

    const checkNumberMatch = (array, number) => {
        let ar = [...array];
        ar.forEach(card => {
            card.number === number ? card.canPlay = true : card.canPlay = false;
        });
        return ar;
    }

    return (
        <div className="H-stack" style={{backgroundColor: '#222f49'}}>
             {hand.map((c) => (
            <Card key={c.id} show={true} card={c}
            className='Hand' handleChange={handleSelect}/>
        ))}
        </div>
    )
}

export default Hand