
import Navbar from '../components/Navbar'
import LoginForm from '../components/LoginForm'
import Signup from '../components/Signup'


import userloginstyle from "../styles/userloginstyle.module.css"


const UserLogin = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div>
        {/* <LoginForm /> */}
        <Signup />
      </div>

    

      
    </div>
  )
}

export default UserLogin