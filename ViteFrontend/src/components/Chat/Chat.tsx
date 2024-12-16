import { useEffect, useState } from "react"
import { UseAuth, User } from "../../libs/Auth/Auth"
import Input from "./Input"
import { Message } from "./Message"
import { useSocket } from "../../libs/Socket/Socket"

export type ChatDetails = {
    user: User,
    id: string,
    history: ChatMessage[],
    locked: boolean,
}

export type ChatMessage = {
    user: User,
    rawText: string,
    creation: Date | number,
}

export const ChatComponent = () => {
    const socket = useSocket()
    const user = UseAuth()
    const [chatDetails, setChatDetails] = useState<ChatDetails>({
        id: "",
        history: [],
        locked: false,
        user: UseAuth()
    })


    socket.on("received_message", (newMessage: ChatMessage) => {
        console.log("Received message from the server:")
        console.log(newMessage)
        newMessage.creation = new Date(newMessage.creation)
        setChatDetails({ ...chatDetails, history: [...chatDetails.history, newMessage] })
    })

    useEffect(() => { }, [])


    socket.on("support_joined", (data) => {
        alert("Support joined the chat!")
        console.log(data)
    })



    return (<>
        <article className="flex-grow-1 overflow-auto p-1 border border-1">
            {/* Chat messages go here */}
            {chatDetails && chatDetails.history.map((message) => <Message {...message} />)}

        </article>
        <aside>
            <Input onSend={(message) => {
                const newMessage: ChatMessage = {
                    user,
                    rawText: message,
                    creation: (new Date().getTime())
                }

                socket.emit("send_message", newMessage);
                if (chatDetails.id == "") {
                    socket.emit("request_chat")
                    setChatDetails({ ...chatDetails, id: "pending" })
                    const waitNewChatId = setTimeout(() => {
                        setChatDetails({ ...chatDetails, id: "" })
                    })
                    socket.on("chat_started", (data) => {
                        clearTimeout(waitNewChatId)
                        setChatDetails({ ...chatDetails, id: data.id })
                    })
                }
            }} />
        </aside>
    </>)
}
export default ChatComponent
