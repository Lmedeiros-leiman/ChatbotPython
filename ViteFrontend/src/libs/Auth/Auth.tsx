import { createContext, ReactNode, useContext, useEffect, useState } from "react"

export type User = {
    name: string,
    type: "support" | "user",
}


const UserContext = createContext<User | undefined>(undefined)

export const UseAuth = () => { return useContext(UserContext as React.Context<User>) }


export const AuthProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [localUser, setUser] = useState<User | undefined>(undefined)

    useEffect(() => {
    if (window.location.href.includes("support")) {
        setUser({name : "Support", type : "support"})
    } else {
        setUser({name : "User", type : "user"})
    }
    }, [])
    if (localUser == undefined) {
        // prevents the app from rendering before the user is authenticated
        return (<></>);
    }
    return (
        <UserContext.Provider value={localUser}>
            {children}
        </UserContext.Provider>
    )
}
export default AuthProvider