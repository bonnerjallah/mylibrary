import { NavLink } from "react-router-dom"
import loginstyle from "../styles/loginstyle.module.css"

const Register = () => {
    return (
        <div className={loginstyle.registerMainContainer}>
            <form>
                <div className={loginstyle.registerHeaderWrapper}>
                    <h1>Online Registration</h1>
                </div>
                <div className={loginstyle.registerFormWrapper}>
                    <label htmlFor="FirstName">
                        First Name:<span style={{color: "red"}}>*</span>
                        <input type="text" name="firstname" id="FirstName" required />
                    </label>

                    <label htmlFor="LastName">
                        Last Name:<span style={{color: "red"}}>*</span>
                        <input type="text" name="lastname" id="LastName" required />
                    </label>

                    <label htmlFor='bday'>
                        Birth Date: (MM/DD/YYYY) <span style={{color: "red"}}>*</span>
                        <input type="text" name='birthday' id='bday' required />
                    </label>

                    <label htmlFor="Address">
                        Address: <span style={{color: "red"}}>*</span>
                        <input type="text" name='address' id='Address' required />
                    </label>

                    <label htmlFor="City">
                        City: <span style={{color:"red"}}>*</span>
                        <input type="text" name='city' id='City' required />
                    </label>

                    <label htmlFor="State">
                        State/Province: <span style={{color: "red"}}>*</span>
                        <input type="text" name='state' id='State' required />
                    </label>

                    <label htmlFor="PostalCode">
                        Postal Code: <span style={{color: "red"}}>*</span>
                        <input type="number" name='postalcode' id='PostalCode' required />
                    </label>

                    <label htmlFor="PhoneNumber">
                        Phone Number: 
                        <input type="number" name='phonenumber' id='PhoneNumber' />
                    </label>

                    <label htmlFor="EmailAddress">
                        Email Address: <span style={{color: 'red'}}>*</span>
                        <input type="email" name='email' id='EmailAddress' required />
                    </label>

                    <label htmlFor="Password">
                        Password: <span style={{color: "red"}}>*</span>
                        <input type="password" name='password' id='Password' required />
                    </label>
                </div>

                <div className={loginstyle.registerButtonWrapper}>
                    <button>Register</button>
                </div>

                <div className={loginstyle.cancelButtonWrapper}>
                    <NavLink to="/Home"><button>Cancel</button></NavLink>
                </div>
            </form>
        </div>
    )
}

export default Register