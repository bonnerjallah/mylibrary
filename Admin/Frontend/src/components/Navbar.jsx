import { NavLink, Outlet } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";


import navbarstyles from "../styles/navbarstyles.module.css"

const Navbar = () => {
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
                </ul>

                <div className={navbarstyles.userWrapper}>
                    <NavLink to="/">
                        <FontAwesomeIcon icon={faUser} className={navbarstyles.user} />
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