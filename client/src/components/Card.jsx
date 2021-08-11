import React from 'react';
import logo from '../assets/logo.svg';

function Card(props) {
    function onClick() {
        props.handleChange(props.card);
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
                    <img src={logo} alt='react logo'></img>
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