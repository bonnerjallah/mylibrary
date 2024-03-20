import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [user , setUser] = useState(null)
    const [token, setToken] = useState(null)

    axios.defaults.withCredentials = true;
    const refreshAccessToken = async ({ setLoggedIn, setUser, logOut }) => {
        try {

            const storedToken = window.localStorage.getItem("token");

            // Check if the user is logged in before attempting to refresh the token
            if(!storedToken) {
                return //Exit the function is user is not logged in
            }

            const response = await axios.post("http://localhost:3001/refresh_token", {}, {
                headers: {"Content-Type": "application/json"}
            });
            
            if (response.status === 200) {
                const userData = response.data;
    
                setLoggedIn(true);
                setUser(userData);
            } else {
                console.error("Token verification failed with status:", response.status);

                logOut();
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            logOut();
        }
    }
    
    useEffect(() => {
        const storedToken = window.localStorage.getItem("token");
    
        const refreshAccessTokenHandler = () => {
            refreshAccessToken({ setToken, setLoggedIn, setUser });
        };
    
        if (loggedIn && storedToken) {
            setLoggedIn(true);
    
            // Set up Interval to refresh the access token
            const refreshAccessTokenInterval = setInterval(refreshAccessTokenHandler, 50 * 1000);
    
            // Clear interval when component unmounts to prevent memory leaks
            return () => {
                clearInterval(refreshAccessTokenInterval);
            };
        } else {
            // If there is no stored token, initiate the token refresh
            refreshAccessTokenHandler();
        }
    }, [loggedIn]);
    
    

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

        window.localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{ loggedIn, login, logOut, user, token }}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext);
