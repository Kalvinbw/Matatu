import '../styles/alert.css';
import React, {useEffect, useState} from 'react';

const Notification = (props) => {
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('this is a notification');
    

    useEffect(() => {
        props.socket.on('notification', (msg) => {
            setShow(true);
            setMsg(msg);
        });

        return () => {
            props.socket.off('notification');
        }
    });

    useEffect(() => {
        let timeout = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => clearTimeout(timeout);
    });

    return (
        <div>
            <div className={show ? "alert show showAlert" : "alert hide"} id='notification'>
                <span className="fas fa-exclamation-circle"></span>
                <span className="msg">{msg}</span>
            </div>
        </div>
        
    );
}

export default Notification;