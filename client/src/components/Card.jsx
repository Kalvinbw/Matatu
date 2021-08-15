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
            myImg = <svg width="50%" height="50%" 
                viewBox="0 0 512 512" 
                xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FF0000" 
                    d="M480.25 156.355c0 161.24-224.25 324.43-224.25 324.43S31.75 317.595 31.75 156.355c0-91.41 70.63-125.13 107.77-125.13 77.65 0 116.48 65.72 116.48 65.72s38.83-65.73 116.48-65.73c37.14.01 107.77 33.72 107.77 125.14z"/>
                    </svg>
            break;
        case 'Club':
            myImg = <svg width="50%" height="50%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M477.443 295.143a104.45 104.45 0 0 1-202.26 36.67c-.08 68.73 4.33 114.46 69.55 149h-177.57c65.22-34.53 69.63-80.25 69.55-149a104.41 104.41 0 1 1-66.34-136.28 104.45 104.45 0 1 1 171.14 0 104.5 104.5 0 0 1 135.93 99.61z"/></svg>;
            break;
        case 'Diamond':
            myImg = <svg width="50%" height="50%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#FF0000" d="M431.76 256c-69 42.24-137.27 126.89-175.76 224.78C217.51 382.89 149.25 298.24 80.24 256c69-42.24 137.27-126.89 175.76-224.78C294.49 129.11 362.75 213.76 431.76 256z"/></svg>;
            break;
        case 'Spade':
            myImg = <svg width="50%" height="50%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M458.915 307.705c0 62.63-54 91.32-91.34 91.34-41.64 0-73.1-18.86-91.83-34.26 2.47 50.95 14.53 87.35 68.65 116h-176.79c54.12-28.65 66.18-65.05 68.65-116-18.73 15.39-50.2 34.28-91.83 34.26-37.29 0-91.34-28.71-91.34-91.34 0-114.47 80.64-83.32 202.91-276.49 122.28 193.17 202.92 162.03 202.92 276.49z"/></svg>;
            break;
        default:
            myImg = <img src={logo} alt='React Logo'></img>;
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
                    {myImg}
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