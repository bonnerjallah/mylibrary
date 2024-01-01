import { useState } from 'react'
import { NavLink } from 'react-router-dom'


import userloginstyle from "../styles/userloginstyle.module.css"

const LoginForm = () => {

  

  return (
    <>
        <div >
            <div className={userloginstyle.formWrapper}>
            <h2>Login</h2>
            <form action="">
                <label htmlFor="user">Username: 
                <input type="text" name='username' id='user' placeholder='Username' required />
                </label>

                <label htmlFor="password">Password:
                <input type="text" name='pwd' id='password' placeholder='Password' required />
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