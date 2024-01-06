import { createContext, useContext, useState, useEffect } from "react";

import axios from "axios"



const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState()
    const [token, setToken] = useState()

    axios.defaults.withCredentials = true
    const refreshAccessToken =  async ({setLoggedIn, setUser}) => {
        try {
            const response = await axios.post("http://localhost:3001/refresh_token", {},{
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200) {
                const userData = response.data
                
                setLoggedIn(true)
                setUser(userData)
            } else {
                console.log("Token verification failed")

                logOut()
            }


        } catch (error) {
            console.error(error)
            logOut()
        }
    }

    useEffect(() => {

        const storedToken = window.localStorage.getItem("token")

        if(storedToken) {
            setLoggedIn(true)

            //Set up interval to refresh the access token
            const refreshAccessTokenInterval = setInterval(() => {
                refreshAccessToken({
                    setToken, //Make sure token is accessible here
                    setLoggedIn,
                    setUser
                })
            }, 50 * 1000);

            //clear the interval when the component unmounts to prevent memory leaks
            return () => {
                clearInterval(refreshAccessTokenInterval)
            }
        } else {
            //if there's no store token, initiate the token refresh
            refreshAccessToken({setToken, setLoggedIn, setUser})
        }
    }, [loggedIn])

    

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