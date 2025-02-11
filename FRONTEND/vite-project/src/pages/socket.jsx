
import {io} from 'socket.io-client';

const socket = io('https://realtimechatsystem.onrender.com', {
    transports: ["websocket"], // Avoids polling issues
    withCredentials: true // Ensures proper CORS handling
});


export default socket;
