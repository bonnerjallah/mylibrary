import loginstyle from "../styles/loginstyle.module.css"

import Footer from "../components/Footer"


const ForgotPassword = () => {
    return (
        <>
            <div className={loginstyle.forgotPasswordMainWrapper}>
                <h3>Forgot your Password?</h3>
                <p>You will receive an email containing further instructions at the address associated with your account. If you do not have an email address on file, please register.</p>

                <div >
                    <label htmlFor="UserName">Email:
                        <input type="text" name='username' id='UserName'  />
                    </label>

                    <button>Send</button>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
        
    )
}

export default ForgotPassword