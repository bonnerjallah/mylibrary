import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faBars } from "@fortawesome/free-solid-svg-icons";

import navstyles from "../styles/navstyles.module.css"

import Searchbar from "./Searchbar"
import Username from "./Username"
import SidebarModal from "./SidebarModal";
import UserNameModal from "./UserNameModal";




const Navbar = () => {

    const {loggedIn, logOut} = useAuth()

    const [OpensidebarModal, setOpenSidebarModal] = useState(false)

    const handleSideBarModal = () => {
        setOpenSidebarModal(true)
    }

    const [showUserNameModal, setShowUserNameModal] = useState(false)

    const handleUserNameModal = () => {
        setShowUserNameModal(!showUserNameModal)
    }


    return (
        <>
            <div className={navstyles.mainContainer}>
                <div className={navstyles.userNameContainer}>

                    {loggedIn ? (
                        <div onClick={handleUserNameModal} className={navstyles.usernameDivWrapper}>
                            <Username />
                        </div>
                    ) : (
                        <div className={navstyles.loginOrRegisterWrapper}>
                            <NavLink to="/LoginForm"><h3>Log In/Register</h3></NavLink>
                        </div>
                    )}

                    {showUserNameModal && (<UserNameModal closemodal={setShowUserNameModal} />)}

                </div>

                <div className={navstyles.linksContainer}>
                    <div className={navstyles.logoContainer}>
                        <NavLink to="/">
                            <div className={navstyles.logoAndNameWrapper}>
                                <div className={navstyles.logoWrapper}>
                                    <img className={navstyles.logo} src="/logo.jpg" alt="" width={80} height={80} style={{borderRadius: "45%", padding: ".5rem" }} />
                                </div>
                                <div className={navstyles.shadow}>
                                    <img src="/logo.jpg" alt="logo2" width={80} height={80} style={{borderRadius: "45%", padding: ".5rem", opacity: '.5' }} className={navstyles.logo}  />
                                </div>
                                <div className={navstyles.header}>
                                    <h1>Conscious Book Club</h1>
                                </div>
                            </div>
                        </NavLink>

                        <div className={navstyles.searchbarContainer}>
                            <Searchbar />
                        </div>
                    </div>

                    <nav>
                        <div className={navstyles.sidebarDiv}>
                            <FontAwesomeIcon icon={faBars} onClick={handleSideBarModal} />
                        </div>  
                        <ul>
                            <li><NavLink to="/Ourpicks">Our picks</NavLink></li>
                            <li><NavLink to="/Discover">Discover</NavLink></li>
                            <li><NavLink to="/Dashboard">Dashboard</NavLink></li>
                            <li className={navstyles.reviews}>
                                <NavLink to="/Social/PostContainer">Social<FontAwesomeIcon icon={faCaretDown} /></NavLink>
                                <div className={navstyles.dropDown}>
                                    <ul>
                                        <li><NavLink>Members</NavLink></li>
                                    </ul>
                                </div>
                            </li>
                            <li><NavLink>Blog</NavLink></li>
                            <li><NavLink>Shop</NavLink></li>
                            <li><NavLink>Who we are</NavLink></li>
                        </ul>
                    </nav>
                    
                    {OpensidebarModal && (<SidebarModal closeSidebarModal={setOpenSidebarModal} />)}

                </div>
            </div>
            <Outlet />
        </>
        
    )
}

export default Navbar