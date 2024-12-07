import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'

import axios from 'axios';
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";

import usernamestyle from "../styles/usernamestyle.module.css"
import { useEffect, useState } from 'react';

const backEndUrl = import.meta.env.VITE_BACKEND_URL


const UserNameModal = ({closemodal}) => {

    const {logOut, user} = useAuth()

    const navigate = useNavigate()

    const [member, setMember] = useState('')

    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return

            try {
                const token = Cookies.get("token")
                const response = await axios.get(`${backEndUrl}/libraryusers`, {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetching user data", response.data)

            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${backEndUrl}/clientLogout`, {}, {
                withCredentials: true
            })
            
        } catch (error) {
            console.log("Error loging out user", error)
        }

        logOut()
        
        setTimeout(() => {
            closemodal(false)
        }, 100)

        navigate("/")
    }


    return (
        <div className={usernamestyle.UserNameModalMainContainer}>
            <div className={usernamestyle.accountAndLogOutContainer}>
                <div className={usernamestyle.accountWrapper}>
                    <h4><NavLink to="/Dashboard">My Account</NavLink></h4>
                    <div className={usernamestyle.usernameIconsWrapper}>
                        <div className={usernamestyle.bellIconWrapper}>
                            <span>{member && member.user && member.user.messages.length > 0 ? (member.user.messages.length) : ""}</span>
                            <NavLink to="/MessageBoard">
                                <FontAwesomeIcon icon={faBell} className={`${member && member.user && member.user.messages.length > 0 ? usernamestyle.bellIcon : "" }`} />
                            </NavLink>
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