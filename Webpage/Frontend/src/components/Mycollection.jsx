import { LibraryBig, ArrowRight, List } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import dashboardsidebarstyle from "../styles/dashboardsidebarstyle.module.css"

const Mycollection = () => {
    return (
        <div className={dashboardsidebarstyle.myCollectionMainContainer} style={{padding:" 0 1rem"}}>
            <div style={{margin:"1rem"}}>
                <h2>My Collections</h2>
            </div>
            <div style={{margin:"1.2rem", display:"flex", alignItems:"center"}}>
                <p> <LibraryBig /> <span style={{fontSize:"1.2rem"}}>On my shelves</span></p> 
            </div>
            <div style={{padding:"0 1rem"}}>
                <p>Keep a record of everything you’ve read, watched or listened to, are currently reading, watching or listening to, or want to borrow in the future.</p>
            </div>
            <div className={dashboardsidebarstyle.laterProgressCompletedWrapper}>
                <NavLink to="/shelf">
                    <h3>For Later <span> <ArrowRight /></span></h3>
                </NavLink>
                <NavLink to="/shelf">
                    <h3>In Progress <span><ArrowRight /></span></h3>
                </NavLink>
                <NavLink to="/shlef">
                    <h3>Completed <span><ArrowRight /></span></h3>
                </NavLink>
            </div>
            <div>
                <p style={{margin:"1.2rem", display:"flex", alignItems:"center"}}><List /> <span style={{fontSize:"1.2rem", marginLeft:".5rem"}}>List</span></p>
                <p style={{margin:"1.2rem"}}>Create themed lists and share your recommendations within the community.</p>
            </div>
            <div style={{width:"100%", display:"flex", justifyContent:"flex-end", margin:"1rem", paddingRight:".5rem"}}>
                <NavLink>
                    <p className={dashboardsidebarstyle.getStarded}>Get started <ArrowRight /></p>
                </NavLink>
            </div>
        </div>
    )
}

export default Mycollection