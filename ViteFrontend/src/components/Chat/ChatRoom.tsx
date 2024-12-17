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
import { useGeneralSocket } from "../../libs/Socket/Socket"
import { Socket } from "socket.io-client"


export type ChatRoomProps = {
    id?: string,
}


export type ChatDetails = {
    user: User,
    id: string,
    history: ChatMessage[],
    locked: boolean,
}


export const ChatRoom: React.FC<ChatRoomProps> = ({ id = "pending" }) => {
    const localUser = UseAuth();
    const socket = useGeneralSocket() as Socket;
    //
    const [chatDetails, setChatDetails] = useState<ChatDetails>({
        id: id,
        history: [],
        locked: false,
        user: localUser,
    })

    useEffect(() => {
        socket.on("received_message", (newMessage: ChatMessage) => {
            console.log(newMessage)
            newMessage.creation = new Date(newMessage.creation)
            setChatDetails((prevChatData) => ({
                ...prevChatData,
                history: [...prevChatData.history, newMessage]
            }));
        });

        socket.on("support_joined", () => {

        });

        return () => {
            socket.off()
        }
    }, [])


    return (<>
        <article className="flex-grow-1 overflow-auto p-1 border border-1">
            {chatDetails && chatDetails.history.map((message) => <Message {...message} />)}
        </article>
        <aside>
            <Input onSend={(message) => {
                const newMessage: ChatMessage = {
                    user: localUser,
                    rawText: message,
                    creation: new Date().getTime(),
                };

                socket.emit("send_message", newMessage);

                if (chatDetails.id === "pending") {
                    if (localUser.type != "user") { return; }
                    socket.emit("request_new_chat", localUser);

                    setChatDetails((prevChatDetails) => ({
                        ...prevChatDetails,
                        id: "waiting",
                    }));

                    const waitNewChatId = setTimeout(() => {
                        setChatDetails((prevChatDetails) => ({
                            ...prevChatDetails,
                            id: "pending",
                        }));
                    }, 60000); // wait 60 seconds before giving up

                    const handleChatStarted = (data: { id: string }) => {
                        clearTimeout(waitNewChatId);
                        setChatDetails((prevChatDetails) => ({
                            ...prevChatDetails,
                            id: data.id,
                        }));
                    };

                    socket.on("chat_started", handleChatStarted);

                    // Clean up listener on component unmount
                    return () => {
                        socket.off("chat_started", handleChatStarted);
                    };
                }
            }} />
        </aside>
    </>)
}
export default ChatRoom;