import ReactMarkdown from "react-markdown"
import { User } from "../../libs/Auth/Auth"

// TODO::
// - Create a message group component
// - that will group multiple messages from the same user into a single blob.
// 
// 



export type ChatMessage = {
    user: User,
    rawText: string,
    creation: Date | number,
}


export const Message : React.FC<ChatMessage> = ({user, rawText, creation}) => {
    
    
    
    return (<article>
        <span>{user.name} <sub>{(creation as Date).toLocaleDateString()} {}</sub></span>
        <ReactMarkdown>{rawText}</ReactMarkdown>
    </article>)
}

