import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState()
    const [token, setToken] = useState()

    const login = (userData, token) => {
        setLoggedIn(true)
        setUser(userData)

        window.localStorage.setItem("token", token)

        setToken(token)
    }


    const logOut = () => {
        setLoggedIn(false)
        setUser(null)
        setToken(null)

        //Remove token from local storage
        window.localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{loggedIn, login, logOut, user, token}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)