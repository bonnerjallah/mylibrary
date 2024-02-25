import { NavLink } from "react-router-dom"
import loginstyle from "../styles/loginstyle.module.css"


const Login = () => {
    return (
        <div className={loginstyle.mainContainer}>
            <div className={loginstyle.header}>
                <h1>Where Curious Minds Meet!!</h1>
            </div>
            <div className={loginstyle.formWrapper}>
                <form>
                    <label htmlFor="UserName">Username:</label>
                    <input type="text" name='username' id='UserName' />

                    <label htmlFor="Password">Password:</label>
                    <input type="password" name='password' id='Password' />

                    <p><NavLink to="/ForgotPassword">Forgot your Password?</NavLink></p>

                    <div className={loginstyle.buttonWrapper}>
                        <button>Log In</button>
                        <p><NavLink to="/Register">Register</NavLink></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

