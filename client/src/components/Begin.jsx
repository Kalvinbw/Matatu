import '../styles/App.css';
import Header from './header';
import Rules from './rules';
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

function Begin() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');


    return (
        <div style={{backgroundColor: 'rgb(77, 77, 77)'}}>
            <Header text='Matatu!'/>
            <div className='App-body'>
                <div>
                    <input type='text' 
                    placeholder='Name' 
                    onChange={(e) => setName(e.target.value)} ></input>
                </div>
                <div>
                    <input type='text' 
                        placeholder='Room' 
                        onChange={(e) => setRoom(e.target.value)} ></input>
                </div>
                <div>
                    <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/app?name=${name}&room=${room}`}>
                        <button type='submit' className='button'>Join/Create New Room</button>
                    </Link>
                </div>
                <Rules/>
            </div>
                  
               
          
        </div>
        
    );
}

export default Begin;