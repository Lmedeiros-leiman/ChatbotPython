import React, { useContext } from "react"
import { io } from "socket.io-client"


const socketContext = React.createContext(io('http://127.0.0.1:5000/'))

export const useSocket = () => {
    return useContext(socketContext)
}

export default function SocketProvider({children}: {children: React.ReactNode}) {
    const socket = useContext(socketContext)

    //const connection = io('http://127.0.0.1:5000/')
    socket.on("connect", () => {
        console.log("This one happend")
    })
    
    // we start the socket, check for a connection saved in localstorage and connect to it IF its still open.



    return(
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}