import SocketProvider from "../libs/Socket/Socket"
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { ChatSquareDotsFill } from "react-bootstrap-icons";
import ChatRoom from "./Chat/ChatRoom";

export const SupportRequestPanel = () => {
    const [show, setShow] = useState(false);

    return (<>
        <button className=" border-0 bg-transparent" onClick={() => setShow(true)}>
            <ChatSquareDotsFill color={"white"} size={48} className=" mb-2 me-1 rounded bg-primary p-1 " />
        </button>
        <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
            <Offcanvas.Header closeButton>
                <h3 className="m-0">Support Live Chat</h3>
            </Offcanvas.Header>
            <Offcanvas.Body
                className="d-flex flex-column p-0 h-100">
                {/* Chat Area */}
                <SocketProvider>
                    <ChatRoom />
                </SocketProvider>
            </Offcanvas.Body>
        </Offcanvas>
    </>)
}
export default SupportRequestPanel

