//
// This components receives am ID to a chat room.
// it produces and store the chat history on an array of messages that get inserted as a line.
// 
// if no id is provided, a new chat room is created with the current socket ID (create the socket if not a thing too) 
// IF there is an ID provided, request the chat history from the server (if not saved locally) and connect to the chat room.
//

import { useEffect, useState } from "react"
import { UseAuth, User } from "../../libs/Auth/Auth"
import Input from "./Input"
import { ChatMessage, Message } from "./Message"
import { useSocket } from "../../libs/Socket/Socket"
import { Socket } from "socket.io-client"


export type ChatRoomProps = {
    roomDetails?: ChatDetails,
    disabled?: boolean
}


export type ChatDetails = {
    user: User,
    room: string,
    history: ChatMessage[],
    locked: boolean,
}


export const ChatRoom: React.FC<ChatRoomProps> = ({ roomDetails, disabled=false }) => {
    const localUser = UseAuth();
    const socket = useSocket() as Socket;
    //
    const [chatDetails, setChatDetails] = useState<ChatDetails>({
        room: roomDetails?.room || "",
        history: [],
        locked: false,
        user: localUser,
    })

    useEffect(() => {
        socket.on("received_message", (newMessage: ChatMessage) => {
            newMessage.creation = new Date(newMessage.creation)
            setChatDetails((prevChatData) => ({
                ...prevChatData,
                history: [...prevChatData.history, newMessage ]
            }));
        });

        socket.on("received_chat_history", (chatHistory : ChatMessage[]) => {
            setChatDetails((prevChatData) => ({
                ...prevChatData,
                history: [...chatHistory, ...prevChatData.history]
            }))
        })

        socket.on("support_joined", () => {

        });


        return () => {
            socket.off()
        }
    }, [])

    if (roomDetails?.room === "" && localUser.type == "support") {
        return (<>
        </>)
    }

    return (<>
        <div className="d-flex flex-column h-100">
        {/* Chat History */}
        <article className="flex-grow-1 overflow-auto p-1 border border-1">
            {chatDetails &&
                chatDetails.history.map((message) => (
                    <Message {...message} key={message.creation as number} />
                ))}
        </article>

        {/* Input Field */}
        <aside className="border-top p-2 bg-light">
            <Input
                disabled={disabled}
                onSend={(message) => {
                    const newMessage: ChatMessage = {
                        user: localUser,
                        chatRoom: roomDetails?.room || "",
                        rawText: message,
                        creation: new Date().getTime(),
                    };

                    
                    
                    socket.emit("send_message", newMessage);
                }}
            />
        </aside>
    </div>
    </>)
}
export default ChatRoom;