import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user , setUser] = useState()
    const [token, setToken] = useState()

    axios.defaults.withCredentials = true
    async function refreshAccessToken ({setLoggedIn, setUser}) {
        try {
            const response = await axios.post("http://localhost:3001/refresh_token", {}, {
                headers:{"Content-Type": "aplication/json"}
            })
            
            if(response.status === 200) {
                const userData = response.data

                setLoggedIn(true)
                setUser(userData)

            } else {
                console.log("Error fetching user data", error)
                logOut()
            }

        } catch (error) {
            console.log(error)
            logOut()
        }
    }

    useEffect(() => {
        
        const storedToken = window.localStorage.getItem("token")

        if(storedToken) {
            
            setLoggedIn(true)

            //set up Interval to refresh the access token
            const refreshAccessTokenInterval = setInterval(() => {
                refreshAccessToken({
                    setToken,
                    setLoggedIn,
                    setUser
                }, 40 * 60 * 1000)
            })

            //Clear interval when component unmounts to prevent memory leaks
            return () => {
                clearInterval(refreshAccessTokenInterval)
            }
        } else {
            //If there is no stored token, initiate the token refresh
            refreshAccessToken({setToken, setLoggedIn, setUser})
        }
    }, [])

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

        window.localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{ loggedIn, login, logOut, user, token }}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext);
