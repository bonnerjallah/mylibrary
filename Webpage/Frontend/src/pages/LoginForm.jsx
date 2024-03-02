import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"

import {useAuth} from "../components/AuthContext"

import Cookies from "js-cookie"

import loginstyle from "../styles/loginstyle.module.css"

import Footer from "../components/Footer"


const LoginForm = () => {

    const {login} = useAuth()

    const navigate = useNavigate()

    const [userMessage, setUserMessage] = useState('')

    const [userLoginInputData, setUserLoginInputData] = useState({
        username:"",
        password: ""
    })

    const handleLoginData = (e) => {
        const {name, value} = e.target

        setUserLoginInputData(prev => ({...prev, [name]: value}))
    }

    axios.defaults.withCredentials = true
    const handleInputSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3001/loginlibraryusers", userLoginInputData, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200){

                const token = Cookies.get("token")

                const {userData} = response.data

                login(userData, token)

                setUserLoginInputData({
                    username:"",
                    password:""
                })
            }

            navigate("/Dashboard")

            
        } catch (error) {
            console.log("Error loging in user", error)
            setUserMessage(error.response.data.message)
            
        }
    }





    return (
        <div className={loginstyle.mainContainer}>
            <div className={loginstyle.header}>
                <h1>Where Curious Minds Meet!!</h1>
            </div>

            {userMessage && (<p style={{color:"red", marginLeft:"3rem"}}>{userMessage}</p>)}

            <div className={loginstyle.formWrapper}>
                <form onSubmit={handleInputSubmit} encType="mulitpart/ form-data" method="POST">
                    <label htmlFor="UserName">Username:</label>
                    <input type="text" name='username' value={userLoginInputData.username} id='UserName' onChange={handleLoginData} />

                    <label htmlFor="Password">Password:</label>
                    <input type="password" name='password' value={userLoginInputData.password} id='Password' onChange={handleLoginData} />

                    <p><NavLink to="/ForgotPassword">Forgot your Password?</NavLink></p>

                    <div className={loginstyle.buttonWrapper}>
                        <button>Log In</button>
                        <p><NavLink to="/Register">Register</NavLink></p>
                    </div>
                </form>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default LoginForm

