import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { ChatSquareDotsFill } from "react-bootstrap-icons";
import SocketProvider, { useSocket } from "../../libs/Socket/Socket";


export const UserMessage: React.FC<{message: string}> = ({message = ''}) => {
    return (<article className="text-start">
        <span>12:01 PM - Cassio</span>
        <div className=" bg-success-subtle ps-2 p-1 border-1 rounded-top-3 rounded-end-4">{message}</div>
    </article>)
}


export function SupportMessage() {
    return(<article className="text-end ">
        <div>12:02 PM - Support</div>
        <div className=" bg-primary text-white p-1 pe-2 border-1 rounded-top-3 rounded-start-4 ">Hi! How can I help you?</div>
    </article>)
}


export function RequestSupportDisplay() {
    const socket = useSocket()
    const [message, setMessage] = useState("")
    const [chatHistory, setChatHistory] = useState<string[]>([])

    socket.on("received_message", (data) => {
        console.log("Received messages from the server:")
        setChatHistory( [...chatHistory, data.message] )
    })
    


    const [show, setShow] = useState(false);

    return (
        <>
            <button className=" border-0 bg-transparent" onClick={() => setShow(true)}> 
                <ChatSquareDotsFill color={"white"} size={48} className=" mb-2 me-1 rounded bg-primary p-1 "/> 
            </button>
            
            <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <h3 className="m-0">Support Live Chat</h3>
                </Offcanvas.Header>
                <Offcanvas.Body
                    className="d-flex flex-column p-0"
                    style={{ height: "100%" }} >
                    {/* Chat Area */}
                    <div className="flex-grow-1 overflow-auto p-3">
                        {/* Chat messages go here */}    
                        <ul className="chat-messages-container flex gap-2 flex-wrap">
                            {chatHistory && chatHistory.map((message, index) => <UserMessage message={message} key={index} />)}
                        </ul>
                    
                    </div>
                    {/* Form Area */}
                    <div className="p-2 bg-light border-top">
                        <form onSubmit={(e) => {
                            e.preventDefault(); 
                            socket.emit("send_message", {message: message});
                            setMessage("")

                        }} className="d-flex align-items-center">
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                                className="form-control me-2"
                                placeholder="Type your message..."
                                style={{ resize: "none" }}
                            ></textarea>
                            <button type="submit" className="btn btn-primary">
                                Send
                            </button>
                        </form>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}


export default function SupportPanel() {

    return (<SocketProvider>
        <RequestSupportDisplay />
    </SocketProvider>)
}

