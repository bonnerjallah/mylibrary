import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";

import usernamestyle from "../styles/usernamestyle.module.css"
import { NavLink } from 'react-router-dom';

const UserNameModal = ({closeUserNameModal}) => {
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
                    <button>Log Out</button>
                </div>
            </div>
        </div>
    )
}

export default UserNameModal