import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "./AuthContext";


import navbarstyles from "../styles/navbarstyles.module.css"

const Navbar = () => {

    const {loggedIn, logOut} = useAuth()

    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            const res = await axios.post("http://localhost:3001/logout", {}, {
                withCredential: true
            })
        } catch (error) {
            console.error("Error loging Out", error)

        }

        logOut()

        navigate("/")
    }

    return (
        <div className={navbarstyles.mainContainer}>

            <div className={navbarstyles.nameWrapper}>
                <NavLink to="/">
                    <div className={navbarstyles.logoWrapper}>
                        <img src="../Images/logo.jpg" alt="logo" width={80} height={80} style={{borderRadius: "45%", padding: ".5rem" }} className={navbarstyles.logo}  />
                    </div>
                </NavLink>

                <div className={navbarstyles.shadow}>
                    <img src="../Images/logo.jpg" alt="logo2" width={80} height={80} style={{borderRadius: "45%", padding: ".5rem", opacity: '.5' }} className={navbarstyles.logo}  />
                </div>

                <div className={navbarstyles.name}>
                    <h1>CONSCIOUS LIBRARY <small style={{ fontSize: '1rem', color: "black" }}>...Admin</small></h1>
                </div>
            </div>

            <div className={navbarstyles.links}>
                <ul>
                    <NavLink to="/AddBook">
                        <li>Add Books</li>
                    </NavLink>
                    <NavLink to="/AddSuggestions">
                        <li>Add Suggestions</li>
                    </NavLink>
                    <NavLink to="/BooksBorrowedOut">
                        <li>Books Management</li>
                    </NavLink>
                </ul>

                <div className={navbarstyles.userWrapper}>
                    <NavLink to="/">

                        {loggedIn ? (
                            <div className={navbarstyles.logInWrapper}>
                                <button onClick={handleLogOut}>Log Out</button>
                            </div>
                            ) : (
                            <FontAwesomeIcon icon={faUser} className={navbarstyles.user} />
                        )}
                        
                    </NavLink>
                </div>
            </div>
            
            <main>
                <Outlet />
            </main>

        </div>
    )
}

export default Navbar