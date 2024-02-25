import loginstyle from "../styles/loginstyle.module.css"

const ForgotPassword = () => {
    return (
        <div className={loginstyle.forgotPasswordMainWrapper}>
            <h3>Forgot your Password?</h3>
            <p>You will receive an email containing further instructions at the address associated with your account. If you do not have an email address on file, please contact a librarian to retrieve your password.</p>

            <div >
                <label htmlFor="UserName">UserName:</label>
                <input type="text" name='username' id='UserName'  />

                <button>Send</button>
            </div>
        </div>
    )
}

export default ForgotPassword