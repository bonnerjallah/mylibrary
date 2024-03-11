import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

import dashboardsidebarstyle from "../styles/dashboardsidebarstyle.module.css"

const Myprofilebox = () => {

    const {user} = useAuth()

    const [member, setMember] = useState("")


    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers:{"Content-Type": "application/json", "Authorization": `Bearer${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("Error fetching data form database", response.data)

            } catch (error) {
                console.error("Error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])


    return (
        <div className={dashboardsidebarstyle.profileboxMainContainer} style={{padding:" 0 1rem 1rem 1rem"}}>
            <div style={{marginTop:"1rem"}}>
                <h2 style={{display:"flex", alignItems:"center"}}><User fill='black' /> My Profile</h2>
            </div>
            <div style={{marginTop:"1rem", display:"flex", flexDirection:"column"}}>
                <div style={{display:"flex"}}>
                    <p className={dashboardsidebarstyle.username} style={{fontSize:"1.5rem"}}> {member && (<span style={{backgroundColor:"#720026", borderRadius:"50%", color:"white", padding:" 0 .5rem", fontSize:"1.5rem"}}>{member.user.userName.charAt(0).toUpperCase()}</span>)}  {member &&(<span>{member.user.userName}</span>)}</p>
                </div>
                <p>Conscious Book Club</p>
            </div>
        </div>
    )
}

export default Myprofilebox