import { createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8900")
const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
export { SocketContext, SocketProvider };