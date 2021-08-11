import React from 'react';


function Header(props) {
    return (
        <div className='App-header'>
            <p>{props.text}</p>
        </div>
    );
}

export default Header;