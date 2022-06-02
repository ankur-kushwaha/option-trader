import React from "react";

type User={
    user:any,
    setUser?:any
}
export const UserContext = React.createContext<User>({
    user:{}
});

export function UserProvider({children}){
    const [user, setUser] = React.useState({});

    return <UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>
}