// This is supposed to be used on the support side, HOWEVER it can be also used on the client side to view old messages.
//
// This components receives nothing and is self closed.
// This components requires access to a web socket provider
//
// this component will render a list of all chats where this user is a participant (as clikable boxes)
// when clicking one of these boxes the websocket will connect to the chat room and open a new chat window.
//

import { useEffect, useState } from "react"
import ChatRoom, { ChatDetails } from "./ChatRoom"
import { useSocket } from "../../libs/Socket/Socket"

import AlertSound from "../../assets/alert.wav"
import { Socket } from "socket.io-client"
import { User } from "../../libs/Auth/Auth"


export type newChatRequest = {
    requester: User
    roomID: string,
}

export const ChatList = () => {
    const socket = useSocket() as Socket
    const [chatList, setChatList] = useState<ChatDetails[]>([])
    const [selectedRoom, setSelectedRoom] = useState<undefined | ChatDetails>(undefined)

    useEffect(() => {
        socket.on("chat_started", (data: newChatRequest) => {

            setChatList((prevChatList) => {
                return [...prevChatList, {
                    room: data.roomID,
                    user: data.requester,
                    history: [],
                    locked: false
                }]
            })

            new Audio(AlertSound).play()

        })
    }, [])





    return (
        <section className="vh-100 d-flex flex-column">
    <div className="d-flex h-100 w-100">
        {/* Sidebar - Always visible on desktop */}
        <aside className="d-none d-md-block col-md-4 col-lg-3 bg-light p-3 border-end">
            <h5 className="mb-4 text-primary">Chats</h5>
            <div className="list-group list-group-flush">
                {chatList.map((chat: ChatDetails) => (
                    <ChatListOption
                        onClick={() => setSelectedRoom(chat)}
                        room={chat}
                        key={chat.room}
                    />
                ))}
            </div>
        </aside>

        {/* Chat Area */}
        {selectedRoom ? (
            <div className="flex-grow-1 d-flex flex-column h-100">
                {/* Header with Back Button */}
                <header className="d-flex align-items-center bg-light border-bottom px-3 py-2">
                    <button
                        className="btn btn-outline-primary me-3 d-md-none"
                        onClick={() => setSelectedRoom(undefined)}
                    >
                        ← Back
                    </button>
                    <h5 className="mb-0">{selectedRoom.user.name}</h5>
                </header>

                {/* Chat Content */}
                <main className="flex-grow-1 p-4 d-flex flex-column">
                    <ChatRoom
                        roomDetails={selectedRoom}
                        disabled={!selectedRoom}
                    />
                </main>
            </div>
        ) : (
            <aside className="d-md-none flex-grow-1 bg-light p-3">
                <h5 className="mb-4 text-primary">Chats</h5>
                <div className="list-group list-group-flush">
                    {chatList.map((chat: ChatDetails) => (
                        <ChatListOption
                            onClick={() => setSelectedRoom(chat)}
                            room={chat}
                            key={chat.room}
                        />
                    ))}
                </div>
            </aside>
        )}
    </div>
</section>);
}
export default ChatList

type ChatListOptionProps = {
    onClick: () => void,
    room: ChatDetails
}

const ChatListOption: React.FC<ChatListOptionProps> = ({ onClick, room }) => {
    return (
        <div
            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between px-3 py-2"
            onClick={onClick}
            style={{ cursor: "pointer" }}
        >
            <div className="flex-grow-1">
                <strong className="text-dark">{room.user.name} - 
                    <span>
                        <small className="text-muted"> {room.room} </small>
                    </span>
                </strong>
                <div className="text-muted small">
                    Some placeholder content below the heading.
                </div>
            </div>
        </div>
    );
};
