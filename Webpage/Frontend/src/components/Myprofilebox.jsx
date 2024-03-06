import { User } from 'lucide-react';

import dashboardsidebarstyle from "../styles/dashboardsidebarstyle.module.css"

const Myprofilebox = () => {
    return (
        <div className={dashboardsidebarstyle.profileboxMainContainer} style={{padding:" 0 1rem 1rem 1rem"}}>
            <div style={{marginTop:"1rem"}}>
                <h2 style={{display:"flex", alignItems:"center"}}><User fill='black' /> My Profile</h2>
            </div>
            <div style={{marginTop:"1rem", display:"flex", flexDirection:"column"}}>
                <div style={{display:"flex"}}>
                    <p className={dashboardsidebarstyle.username} style={{fontSize:"1.5rem"}}> <span style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem", fontSize:"1.5rem"}}>B</span> username</p>
                </div>
                <p>Conscious Book Club</p>
            </div>
        </div>
    )
}

export default Myprofilebox