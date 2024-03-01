import { useState} from "react"
import axios from "axios"
import { NavLink, useNavigate} from "react-router-dom"

import Footer from "../components/Footer"

import loginstyle from "../styles/loginstyle.module.css"

const Register = () => {

    const navigate = useNavigate()

    const [userInputData, setUserInputData] = useState({
        firstname: "",
        lastname: "",
        birthday: "",
        address: "",
        city: "",
        state: "",
        postalcode: "",
        phonenumber: "",
        email: "",
        username: "",
        password: ""
    })

    const handleUserInputData = (e) => {
        const {name, value} = e.target
        setUserInputData(prev => ({...prev, [name] : value}))
    }

    const handleDataSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3001/registerlibraryusers", userInputData, {
                headers: {"Content-Type": "application/json"}
            })

            if(response.status === 200){
                console.log("Insert data successfully")
            }

            setUserInputData({
                firstname: "",
                lastname: "",
                birthday: "",
                address: "",
                city: "",
                state: "",
                postalcode: "",
                phonenumber: "",
                email: "",
                username:"",
                password: ""
            })

            navigate("/Login")
            
        } catch (error) {
            console.log("Error inserting user", error)
            if(response.error){
                console.log(error.response.data)
            }
        }
    }


    return (
        <>
            <div className={loginstyle.registerMainContainer}>
                <form onSubmit={handleDataSubmit} encType="multipart/form-data" method="POST">
                    <div className={loginstyle.registerHeaderWrapper}>
                        <h1>Online Registration</h1>
                    </div>
                    <div className={loginstyle.registerFormWrapper}>
                        <label htmlFor="FirstName">
                            First Name:<span style={{color: "red"}}>*</span>
                            <input type="text" name="firstname" id="FirstName" value={userInputData.firstname} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="LastName">
                            Last Name:<span style={{color: "red"}}>*</span>
                            <input type="text" name="lastname" id="LastName" value={userInputData.lastname} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor='bday'>
                            Birth Date: (MM/DD/YYYY) <span style={{color: "red"}}>*</span>
                            <input type="text" name='birthday' id='bday' value={userInputData.birthday} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="Address">
                            Address: <span style={{color: "red"}}>*</span>
                            <input type="text" name='address' id='Address' value={userInputData.address} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="City">
                            City: <span style={{color:"red"}}>*</span>
                            <input type="text" name='city' id='City' value={userInputData.city} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="State">
                            State/Province: <span style={{color: "red"}}>*</span>
                            <input type="text" name='state' id='State' value={userInputData.state} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="PostalCode">
                            Postal Code: <span style={{color: "red"}}>*</span>
                            <input type="number" name='postalcode' id='PostalCode' value={userInputData.postalcode} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="PhoneNumber">
                            Phone Number: 
                            <input type="number" name='phonenumber' id='PhoneNumber' value={userInputData.phonenumber} onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="EmailAddress">
                            Email Address: <span style={{color: 'red'}}>*</span>
                            <input type="email" name='email' id='EmailAddress' value={userInputData.email} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="UserName">
                            Username: <span style={{color: "red"}}>*</span>
                            <input type="text" name="username" id="UserName" value={userInputData.username} required onChange={handleUserInputData} />
                        </label>

                        <label htmlFor="Password">
                            Password: <span style={{color: "red"}}>*</span>
                            <input type="password" name='password' id='Password' value={userInputData.password} required onChange={handleUserInputData} />
                        </label>
                    </div>

                    <div className={loginstyle.registerButtonWrapper}>
                        <button>Register</button>
                    </div>

                    <div className={loginstyle.cancelButtonWrapper}>
                        <NavLink to="/HomeBase"><button>Cancel</button></NavLink>
                    </div>
                </form>
            </div>

            <div>
                <Footer />
            </div>
        </>
        
    )
}

export default Register