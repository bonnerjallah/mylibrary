import Navbar from '../components/Navbar'

const UserLogin = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div>
        <h2>Login</h2>
        <div>
          <label htmlFor="user"></label>
          <input type="text" name='username' id='user' placeholder='Username' />

          <label htmlFor="password"></label>
          <input type="text" name='pwd' id='password' placeholder='Password' />
        </div>
      </div>
    </div>
  )
}

export default UserLogin