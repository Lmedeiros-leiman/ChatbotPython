import React, { createContext, useContext, useEffect, useMemo } from "react"
import { io, Socket } from "socket.io-client"
import { UseAuth } from "../Auth/Auth"


const SOCKET_URL = 'http://127.0.0.1:5000';

// Create separate contexts for general and support sockets
const GeneralSocketContext = createContext<Socket | null>(null);
const SupportSocketContext = createContext<Socket | null>(null);

export const useGeneralSocket = () => {
    return useContext(GeneralSocketContext);
};

export const useSupportSocket = () => {
    return useContext(SupportSocketContext);
};

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const localUser = UseAuth();

    // Use `useMemo` to initialize sockets only once
    const generalSocket = useMemo(() => io(SOCKET_URL), []);
    const supportSocket = useMemo(() => (localUser?.type === 'support' ? io(`${SOCKET_URL}/support`) : null), [localUser]);

    useEffect(() => {
        // General socket connection logic
        generalSocket.on('connect', () => {
            console.log('Connected to general socket');
        });

        generalSocket.on('disconnect', () => {
            console.log('Disconnected from general socket');
        });

        // Example: handle client-specific events
        generalSocket.on('chat_started', () => {
            alert('CHAT STARTED BY CLIENT');
        });

        return () => {
            generalSocket.disconnect();
        };
    }, [generalSocket]);

    useEffect(() => {
        // Support socket connection logic
        if (supportSocket) {
            supportSocket.on('connect', () => {
                console.log('Connected to support socket');
                supportSocket.emit('support_logged', localUser);
            });

            supportSocket.on('disconnect', () => {
                console.log('Disconnected from support socket');
            });

            // Example: handle support team events
            supportSocket.on('new_support_request', (data) => {
                console.log('New support request:', data);
            });

            return () => {
                supportSocket.disconnect();
            };
        }
    }, [supportSocket, localUser]);

    return (
        <GeneralSocketContext.Provider value={generalSocket}>
            <SupportSocketContext.Provider value={supportSocket}>
                {children}
            </SupportSocketContext.Provider>
        </GeneralSocketContext.Provider>
    );
}