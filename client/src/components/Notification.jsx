import '../styles/alert.css';
import React, {useEffect, useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Notification = (props) => {
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState(undefined);
    

    useEffect(() => {
        props.socket.on('notification', (msg) => {
            console.log(show);
            if(show) {
                setShow(false);
            }
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

    // <div className={show ? "alert show showAlert" : "alert hide"} id='notification'>
    //             <span className="fas fa-exclamation-circle"></span>
    //             <span className="msg">{msg}</span>
    //         </div>

    return (
        <div>
             <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }} 
                open={show} 
                autoHideDuration={6000} 
                onClose={null}>
                <Alert onClose={null} severity="info">
                    {show ? msg : undefined}
                </Alert>
            </Snackbar>
        </div>
        
    );
}

export default Notification;