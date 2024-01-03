import { useState } from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import Signup from '../components/Signup';
import userloginstyle from "../styles/userloginstyle.module.css";

const UserLogin = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleComponent = () => {
    setShowLoginForm(!showLoginForm);
  };

  console.log('showLoginForm:', showLoginForm);

  return (
    <div>

      <div className={userloginstyle.mainContainer}>
        {showLoginForm ? <LoginForm /> : <Signup />}

        <div className={userloginstyle.loginSignUpWrapper}>

          {showLoginForm ? <p onClick={toggleComponent} style={{cursor: "pointer"}}>SignUp</p> : <p style={{ color: '#890620', cursor:"pointer" }} onClick={toggleComponent}>Login</p>} 
        
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
