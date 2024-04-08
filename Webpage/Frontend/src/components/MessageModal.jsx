import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "./AuthContext"
import { NavLink } from "react-router-dom"


import messagemodalstyle from "../styles/messagemodalstyle.module.css"





const MessageModal = () => {
    const {user} = useAuth()


    const [member, setMember] = useState("")

    axios.defaults.withCredentials = true
    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers:{"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("Invalid user data", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])

    console.log(member)



    return (
        <div className={messagemodalstyle.mainContainer}>
            <div className={messagemodalstyle.headerWrapper}>
                <h3>Reminder</h3>
            </div>
            <div>

            </div>

            <div className={messagemodalstyle.headerWrapper}>
                <h3>Notifications</h3>
            </div>
                <div className={messagemodalstyle.notifiWrapper}>
                    <NavLink to="/MessageBoard">
                        <p>View all notifications</p>
                    </NavLink>
                </div>
        </div>
    )
}

export default MessageModal