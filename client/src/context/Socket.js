import { useState } from 'react';
import { createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8900", { withCredentials: true })
const SocketContext = createContext(socket);


const SocketProvider = ({ children }) => {

    const [onlineUsers, setOnlineUsers] = useState([])

    socket.on("getUsers", (data) => setOnlineUsers(data.map(u => u.userId)))

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
export { SocketContext, SocketProvider };