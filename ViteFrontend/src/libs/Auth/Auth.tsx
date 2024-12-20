import { createContext, ReactNode, useContext, useEffect, useState } from "react"

export type User = {
    name: string,
    id: string,
    type: "support" | "user" | "server",
}


const UserContext = createContext<User | undefined>(undefined)

export const UseAuth = () => { return useContext(UserContext as React.Context<User>) }


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [localUser, setUser] = useState<User | undefined>(undefined)

    useEffect(() => {
        // #TODO:: IMPLEMENT A LOGIN SYSTEM.
        // over here we would have a login form
        // HOWEVER since were not implementing that yet, the users get a random UUID.
        // registered users will keep a UUID
        // annonymous users will get a random UUID
        // HOWEVER, annonymous users will not have their data stored
        // ONLY their messages will be stored under ID = 0.

        const localUserId = crypto.randomUUID()

        if (window.location.href.includes("support")) {
            setUser({ name: "Support", type: "support", id: localUserId })
        } else {
            setUser({ name: "User", type: "user", id: localUserId })
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