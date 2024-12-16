import { ChatMessage } from "./Chat";
import ReactMarkdown from "react-markdown"

// TODO::
// - Create a message group component
// that will group multiple messages from the same user into a single blob.

export const Message : React.FC<ChatMessage> = (props) => {
    const {user, rawText, creation} = props

    return (<article>
        <span>{user.name} <sub>{(creation as Date).toLocaleDateString()} {}</sub></span>
        <ReactMarkdown>{rawText}</ReactMarkdown>
    </article>)
}
