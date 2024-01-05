import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import axios from "axios"
import { useAuth } from './AuthContext'

import Cookies from 'js-cookie'


import userloginstyle from "../styles/userloginstyle.module.css"

const LoginForm = () => {

  const {login} = useAuth()

  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  })

  const handleLoginInput = (e) => {
    const{name, value} = e.target

    setLoginData((prev) => ({
      ...prev, 
      [name]: value
    }))
  }

  const [errorMessage, setErrorMessage] = useState()


  axios.defaults.withCredentials = true
  const handleInputSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:3001/loginadminusers", loginData, {
        headers: {"Content-Type": "application/json"}
      })

      if(response.status === 200) {
        console.log("successfully logged in user")

        //Access token from cookies
        const token = Cookies.get('token')

        //Access the data in the front end
        const {userData} = response.data

        login(userData, token)

        console.log("User", userData)

        setLoginData({
          username: "",
          password: ""
        })

        navigate("/AddBook")
        
      }
    } catch (error) {
      console.error("error fetching user", error)
      setErrorMessage(error.response.data.message)
    }
  }

  return (
    <>
        <div >

            <div className={userloginstyle.formWrapper}>
            {errorMessage && (<p style={{color: "red", textalign: "center"}}>{errorMessage}</p>)}

            <h2>Login</h2>
            <form onSubmit={handleInputSubmit} >
                <label htmlFor="user">Username: 
                <input type="text" name='username' id='user' value={loginData.username} placeholder='Username' onChange={handleLoginInput} required />
                </label>

                <label htmlFor="pwd">Password:
                <input type="password" name='password' id='pwd' value={loginData.password} placeholder='Password' onChange={handleLoginInput} required />
                </label>

                <div>
                  <button type='submit' className={userloginstyle.loginButton}>Submit</button>
                </div>
            </form>
            </div>
        </div>
    </>
  )
}

export default LoginForm