import { useState} from "react"
import axios from "axios"
import { NavLink, useNavigate} from "react-router-dom"

import Footer from "../components/Footer"

import loginstyle from "../styles/loginstyle.module.css"

const Register = () => {

    const navigate = useNavigate()

    const [UserProfilePicUrl, setUserProfilePicUrl] = useState()
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

    const handleProfilePicInput = (e) => {
        setUserProfilePicUrl(e.target.files[0])
    }

    console.log(UserProfilePicUrl)

    const handleUserInputData = (e) => {
        const {name, value} = e.target
        setUserInputData((prev) => ({...prev, [name] : value}))
    }

    const handleDataSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("firstname", userInputData.firstname)
        formData.append("lastname", userInputData.lastname)
        formData.append("birthday", userInputData.birthday)
        formData.append("address", userInputData.address)
        formData.append("city", userInputData.city)
        formData.append("state", userInputData.state)
        formData.append("postalcode", userInputData.postalcode)
        formData.append("phonenumber", userInputData.phonenumber)
        formData.append("email", userInputData.email)
        formData.append("username", userInputData.username)
        formData.append("password", userInputData.password)

        if(UserProfilePicUrl) {
            formData.append("profilepic", UserProfilePicUrl, UserProfilePicUrl.name )
        }


        try {
            const response = await axios.post("http://localhost:3001/registerlibraryusers", formData, {
                headers: {"Content-type": "multipart/form-data"}
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

            navigate("/LoginForm")
            
        } catch (error) {
            console.log("Error inserting user", error)
            if(error.response){
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

                        <label htmlFor="ProfilePic">Profile Pic:
                            <input type="file" name="profilepic" id="ProfilePic" accept="image/*" onChange={handleProfilePicInput} />
                        </label>
                    </div>

                    <div className={loginstyle.registerButtonWrapper}>
                        <button type="submit">Register</button>
                    </div>

                    <div className={loginstyle.cancelButtonWrapper}>
                        <NavLink to="/"><button>Cancel</button></NavLink>
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