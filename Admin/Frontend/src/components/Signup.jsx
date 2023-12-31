import { NavLink } from 'react-router-dom'


import userloginstyle from "../styles/userloginstyle.module.css"

const Signup = () => {
  return (
    <>
        <div className={userloginstyle.mainContainer}>
            <div className={userloginstyle.signUpFormWrapper}>
            <h2>Sign Up</h2>
            <form action="">

                <label htmlFor="first_name">First Name: 
                <input type="text" name='firstname' id='first_name' placeholder='First Name' required />
                </label>

                <label htmlFor="last_name">Last Name:
                <input type="text" name='lastname' id='last_name' placeholder='Last Name' required />
                </label>

                <label htmlFor="user">Username: 
                <input type="text" name='username' id='user' placeholder='Username' required />
                </label>

                <label htmlFor="password">Password:
                <input type="text" name='pwd' id='password' placeholder='Password' required />
                </label>

                <div className={userloginstyle.loginWrapper}>
                <NavLink>
                    <p>Login</p>
                </NavLink>
                </div>

                <div>
                <button className={userloginstyle.signUpButton}>Submit</button>
                </div>
            </form>
            </div>
        </div>
    </>
  )
}

export default Signup