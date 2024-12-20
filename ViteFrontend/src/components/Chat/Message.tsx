import ReactMarkdown from "react-markdown"
import { User } from "../../libs/Auth/Auth"

// TODO::
// - Create a message group component
// - that will group multiple messages from the same user into a single blob.
// 
// 



export type ChatMessage = {
    user: User,
    chatRoom: "" | string,
    rawText: string,
    creation: Date | number,
}


export const Message : React.FC<ChatMessage> = ({user, rawText, creation}) => {
    
    if (user.type == "server") {
        return (
            <article>
                <ReactMarkdown>{rawText}</ReactMarkdown>
            </article>
        )
    }


    const date = (creation as Date).toLocaleDateString()
    
    return (<article>
        <span>{user.name} <sub>{creation == 0 ? "" : date} {}</sub></span>
        <ReactMarkdown>{rawText}</ReactMarkdown>
    </article>)
}
