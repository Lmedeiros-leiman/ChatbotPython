import React, { useContext } from "react"
import { io } from "socket.io-client"
import AuthProvider from "../Auth/Auth"


const socketContext = React.createContext(io('http://127.0.0.1:5000/'))

export const useSocket = () => {
    return useContext(socketContext)
}

export default function SocketProvider({children}: {children: React.ReactNode}) {
    const socket = useContext(socketContext)

    //primitive socketIO events
    socket.on("connect", () => {
        console.log("Connected to the server.")
    })

    socket.on("disconnect", (reason) => {
        console.log("Disconnected from the server: " + reason)
    })

    socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
    });

    socket.on("connect_timeout", () => {
        console.warn("Connection to the server timed out.")
    });
    
    // we start the socket, check for a connection saved in localstorage and connect to it IF its still open.



    return(
        <AuthProvider >
            <socketContext.Provider value={socket}>
                {children}
            </socketContext.Provider>
        </AuthProvider>
    )
}