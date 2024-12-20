import { useState } from "react"
import { Send } from "react-bootstrap-icons"


export type InputChatProps = {
    onSend?: (message: string) => void,
    disabled? : boolean
}

export const Input: React.FC<InputChatProps> = ({ onSend, disabled = false}) => {

    const [message, setMessage] = useState("")

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        //
        onSend?.(message)

        //
        setMessage("")
    }

    return (<form onSubmit={sendMessage} className="d-flex align-items-center">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)}
            className="form-control me-1 rounded-0 rounded-start-0 rounded-top-3" placeholder="Message" style={{ resize: "none" }}/>
        
        <button type="submit" disabled={ message.trim() === "" || disabled } value="" className=" cursor-pointer outline-none border-0 bg-transparent ">
            <Send className=" rounded-5 bg-success text-white p-2" size={52}  />
        </button>

    </form>)

}
export default Input