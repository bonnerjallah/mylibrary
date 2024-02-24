import { NavLink, Outlet } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import navstyles from "../styles/navstyles.module.css"

import Searchbar from "./Searchbar"
import Username from "./Username"

const Navbar = () => {
    return (
        <>
            <div className={navstyles.mainContainer}>
                <div className={navstyles.userNameContainer}>
                    <h3><Username /></h3>
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
                </div>
            </div>
            <Outlet />
        </>
        
    )
}

export default Navbar