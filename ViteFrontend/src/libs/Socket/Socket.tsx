import React, { createContext, useContext, useEffect, useMemo } from "react"
import { io, Socket } from "socket.io-client"
import { UseAuth } from "../Auth/Auth"


const SOCKET_URL = 'http://127.0.0.1:5000/';

// Create separate contexts for general and support sockets
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const localUser = UseAuth();
    
    const SocketConnection = useMemo(() => io(SOCKET_URL, { auth: localUser }),[localUser]);

    useEffect(() => {
        // General socket connection logic
        SocketConnection.on('connect', () => {
            console.log('Connected to general socket');
        });

        SocketConnection.on('disconnect', () => {
            console.log('Disconnected from general socket');
        });

        return () => {
            SocketConnection.disconnect();
        };
    }, [SocketConnection]);

    return (

        <SocketContext.Provider value={SocketConnection}>
            {children}
        </SocketContext.Provider >  
    );
}