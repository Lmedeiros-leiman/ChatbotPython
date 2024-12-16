import { createContext, ReactNode, useContext, useState } from "react"

export type User = {
    name: string,
    type: "support" | "user",
}

const DefaultUser : User = {
    name: "User",
    type: "user",
}

const UserContext = createContext(DefaultUser)

export const UseAuth = () => { return useContext(UserContext) }


export const AuthProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [localUser] = useState(DefaultUser)


    return (
        <UserContext.Provider value={localUser}>
            {children}
        </UserContext.Provider>
    )
}
export default AuthProvider