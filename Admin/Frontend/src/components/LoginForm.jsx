import { useState } from 'react'
import { NavLink } from 'react-router-dom'


import userloginstyle from "../styles/userloginstyle.module.css"

const LoginForm = () => {

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  })

  const handleLoginInput = (e) => {
    const{name, value} = e.target

    setUserLogin((prev) => ({...prev, [name]: value}))
  }

  const handleInputSubmit = async (e) => {
    e.preventdefault()
    try {
      const response = await axios.post("http://localhost:3001/login", loginData, {
        headers: {"Content-Type": "application/json"}
      })

      if(response.status === 200) {
        console.log("successfully fetch userdata")
      }
    } catch (error) {
      console.error("error fetching user", error)
    }
  }




  return (
    <>
        <div >
            <div className={userloginstyle.formWrapper}>
            <h2>Login</h2>
            <form onSubmit={handleInputSubmit} >
                <label htmlFor="user">Username: 
                <input type="text" name='username' id='user' value={loginData.username} placeholder='Username' onChange={handleLoginInput} required />
                </label>

                <label htmlFor="pwd">Password:
                <input type="text" name='password' id='pwd' value={loginData.password} placeholder='Password' onChange={handleLoginInput} required />
                </label>

                <div>
                  <button className={userloginstyle.loginButton}>Submit</button>
                </div>
            </form>
            </div>
        </div>
    </>
  )
}

export default LoginForm