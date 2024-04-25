import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import { useAuth } from "../components/AuthContext";
import { NavLink, Outlet } from "react-router-dom"
import socialstyle from "../styles/socialstyle.module.css"
import { Home, Video, UsersRound, MessageSquareMore, Bell, Menu, Search  } from 'lucide-react';

const Social = () => {
    const {user} = useAuth()

    const [member, setMember] = useState()

    axios.defaults.withCredentials = true
    useEffect(() => {
        if(!user)return
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token")
                const response = await axios.get("http://localhost:3001/libraryusers", {
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })

                response.data.valid ? setMember(response.data) : console.error("error fetchind user form database", response.data)
                
            } catch (error) {
                console.error("error fetching user data", error)
            }
        }
        fetchUserData()
    }, [])


    return (
        <>
            <div className={socialstyle.mainContainer}>
                <div className={socialstyle.headerContainer}>
                    <div className={socialstyle.searchWrapper}>
                        Search Users:
                        <label htmlFor="UserSearch">
                            <Search size="20" stroke="#168aad" />
                            <input type="search" name="usershearch" id="UserSearch" />
                        </label>
                    </div>
                    <div className={socialstyle.homeVideoGroupIconWrapper}>
                        <ul>
                            <li>
                                <NavLink>
                                    <Home className={socialstyle.homeIcons} />
                                </NavLink>
                                <div className={socialstyle.homeWrapper}>
                                    Home
                                </div>
                            </li>
                            <li>
                                <NavLink>
                                    <Video className={socialstyle.videoIcons} />
                                </NavLink>
                                <div className={socialstyle.videoWrapper}>
                                    Video
                                </div>
                            </li>
                            <li>
                                <NavLink>
                                    <UsersRound className={socialstyle.gorupIcons} />
                                </NavLink>
                                <div className={socialstyle.groupWrapper}>
                                    Group
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={socialstyle.menuMessageBellAndUserWrapper}>
                        <ul>
                            <li>
                                <NavLink>
                                    <Menu size="35" className={socialstyle.menuIcons} />
                                </NavLink>
                                <div className={socialstyle.menuWrapper}>
                                    Menu
                                </div>
                            </li>
                            <li>
                                <NavLink>
                                    <MessageSquareMore size="35" className={socialstyle.messangerIcons} />
                                </NavLink>
                                <div className={socialstyle.messangerWrapper}>
                                    Messanger
                                </div>
                            </li>
                            <li>
                                <NavLink>
                                    <Bell size="35" className={socialstyle.notificationsIcons} />
                                </NavLink>
                                <div className={socialstyle.notificationsWrapper}>
                                    Notifications
                                </div>
                            </li>
                            <li>
                                <NavLink>
                                    {member && member.user && member.user.profilepic && (
                                        <img src={`http://localhost:3001/libraryusersprofilepics/${member.user.profilepic}`} alt=""  width="35" height="35" style={{borderRadius:"50%"}} />
                                    )}
                                </NavLink>
                                <div className={socialstyle.profileIcons}>
                                    Account
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
        
    )
}

export default Social