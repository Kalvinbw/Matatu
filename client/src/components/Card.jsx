import React from 'react';
import logo from '../assets/logo.svg';
import heart from '../assets/hearts.svg'
import club from '../assets/clubs.svg'
import diamond from '../assets/diamonds.svg'
import spade from '../assets/spades.svg'

function Card(props) {
    function onClick() {
        props.handleChange(props.card);
    }

    let myImg;
    switch(props.card.suit) {
        case 'Heart':
            myImg = heart;
            break;
        case 'Club':
            myImg = club;
            break;
        case 'Diamond':
            myImg = diamond;
            break;
        case 'Spade':
            myImg = spade;
            break;
        default:
            myImg = logo;
            break;
    }

    let myClass = props.className;
    if(props.show) {
        myClass = myClass + ' flipped';
        if(props.card.canPlay) {
            myClass = myClass + ' playable'
        }
        if(props.card.selected) {
            myClass = myClass + ' selected';
        }
        return (
            <div className={myClass} onClick={onClick}>
                    <h6>{props.card.suit}</h6>
                    <img src={myImg} alt='react logo'></img>
                    <h6>{props.card.number}</h6>
            </div>
        );
    } else {
        return (
            <div className={props.className} onClick={onClick}>
                <img src={logo} alt='react logo'></img>
                <h6>Click to draw</h6>
            </div>
        );
    }
}

export default Card;