import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faBars } from "@fortawesome/free-solid-svg-icons";

import navstyles from "../styles/navstyles.module.css"

import Searchbar from "./Searchbar"
import Username from "./Username"
import SidebarModal from "./SidebarModal";
import UserNameModal from "./UserNameModal";


const Navbar = () => {

    const [OpensidebarModal, setOpenSidebarModal] = useState(false)

    const handleSideBarModal = () => {
        setOpenSidebarModal(true)
    }

    const [showUserNameModal, setShowUserNameModal] = useState(false)

    const handleUserNameModal = () => {
        if(!showUserNameModal){
            setShowUserNameModal(true)
        } else{
            setShowUserNameModal(false)
        }
    }


    return (
        <>
            <div className={navstyles.mainContainer}>
                <div className={navstyles.userNameContainer}>
                    <div className={navstyles.loginOrRegisterWrapper}>
                        <h3><NavLink to="/Login">Log In/Register</NavLink></h3>
                    </div>
                    {/* <div onClick={handleUserNameModal} className={navstyles.usernameDivWrapper}>
                        <Username />
                    </div> */}
                    {showUserNameModal && (<UserNameModal />)}
                </div>

                <div className={navstyles.linksContainer}>
                    <div className={navstyles.logoContainer}>
                        <NavLink to="/Home">
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
                            <li><NavLink>Our picks</NavLink></li>
                            <li><NavLink>Discove</NavLink>r</li>
                            <li><NavLink>Books</NavLink></li>
                            <li className={navstyles.reviews}>
                                <NavLink>Reviews<FontAwesomeIcon icon={faCaretDown} /></NavLink>
                                <div className={navstyles.dropDown}>
                                    <ul>
                                        <li><NavLink>Members</NavLink></li>
                                        <li><NavLink>Social</NavLink></li>
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