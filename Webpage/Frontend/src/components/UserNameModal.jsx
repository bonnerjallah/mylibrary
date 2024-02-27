import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";

import usernamestyle from "../styles/usernamestyle.module.css"

const UserNameModal = ({closemodal}) => {

    const {logOut} = useAuth()

    const navigate = useNavigate()

    const handleLogOut = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("/http:localhost:3001/logout", {}, {
                withCredential: true
            })
            
        } catch (error) {
            console.log("Error loging out user", error)
        }

        logOut()
        
        setTimeout(() => {
            closemodal(false)
        }, 100)

        navigate("/Home")
    }

    return (
        <div className={usernamestyle.UserNameModalMainContainer}>
            <div className={usernamestyle.accountAndLogOutContainer}>
                <div className={usernamestyle.accountWrapper}>
                    <h4><NavLink>My Account</NavLink></h4>
                    <div className={usernamestyle.usernameIconsWrapper}>
                        <div className={usernamestyle.bellIconWrapper}>
                            <FontAwesomeIcon icon={faBell}  />
                        </div>
                        <div className={usernamestyle.gearIconWrapper}>
                            <FontAwesomeIcon icon={faGear}/>
                        </div>
                    </div>
                </div>
                <div className={usernamestyle.userNameButtonWrapper}>
                    <button onClick={handleLogOut}>Log Out</button>
                </div>
            </div>
        </div>
    )
}

export default UserNameModal