import { useState } from 'react'
import axios from "axios"


import userloginstyle from "../styles/userloginstyle.module.css"



const Signup = () => {

  const [adminSignUp, setAdminSignUp] = useState({
    firstname:"",
    lastname: "",
    email: "",
    username: "",
    password: "",
  })

  const handleSignUpInput = (e) => {
    const {name , value} = e.target 

    setAdminSignUp((prev) => ({...prev, [name]: value}))
  }


  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log("Info being sent", adminSignUp)
      const response = await axios.post("http://localhost:3001/registeradminusers", adminSignUp, {
        headers: {"Content-Type": "application/json"}
      });
      
      if (response.status === 200) {
        console.log("Admin user inserted successfully");
      }
  
      setAdminSignUp({
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: ""
      });


    } catch (error) {
      console.error("Error inserting data", error);
      if (error.response) {
        console.log(error.response.data); // Log the response error data
      }
    }
  };
  


  return (
    <>
      <div className={userloginstyle.signUpFormContainer}>
        <div className={userloginstyle.signUpFormWrapper}>
          <h2>Sign Up</h2>
          <form onSubmit={handleFormSubmit}>

            <label htmlFor="first_name">First Name: 
              <input type="text" name='firstname' id='first_name' placeholder='First Name' value={adminSignUp.firstname} required onChange={handleSignUpInput} />
            </label>

            <label htmlFor="last_name">Last Name:
              <input type="text" name='lastname' id='last_name' placeholder='Last Name' value={adminSignUp.lastname} required onChange={handleSignUpInput} />
            </label>

            <label htmlFor="userEmail">Email:
              <input type="email" name='email' id='userEmail' placeholder='Email' value={adminSignUp.email} required style={{marginLeft: "3.4rem"}} onChange={handleSignUpInput} />
            </label>

            <label htmlFor="user">Username: 
              <input type="text" name='username' id='user' placeholder='Username' value={adminSignUp.username} required style={{marginLeft: "1.7rem"}} onChange={handleSignUpInput} />
            </label>

            <label htmlFor="pwd">Password:
              <input type="password" name='password' id='pwd' placeholder='Password' value={adminSignUp.password} required style={{marginLeft: "1.9rem"}} onChange={handleSignUpInput} />
            </label>

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