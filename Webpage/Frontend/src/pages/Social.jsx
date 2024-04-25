import { NavLink, Outlet } from "react-router-dom"
import socialstyle from "../styles/socialstyle.module.css"
import { Home, Video, UsersRound, MessageSquareMore, Bell, Menu, Search  } from 'lucide-react';

const Social = () => {
    return (
        <>
            <div className={socialstyle.mainContainer}>
                <div className={socialstyle.headerContainer}>
                    <div className={socialstyle.searchWrapper}>
                        Search Users:
                        <label htmlFor="">
                            <Search size="20" stroke="#168aad" />
                            <input type="search" />
                        </label>
                    </div>
                    <div className={socialstyle.homeVideoGroupIconWrapper}>
                        <ul>
                            <li>
                                <Home className={socialstyle.homeIcons} />
                                <div className={socialstyle.homeWrapper}>
                                    Home
                                </div>
                            </li>
                            <li>
                                <Video className={socialstyle.videoIcons} />
                                <div className={socialstyle.videoWrapper}>
                                    Video
                                </div>
                            </li>
                            <li>
                                <UsersRound className={socialstyle.gorupIcons} />
                                <div className={socialstyle.groupWrapper}>
                                    Group
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={socialstyle.menuMessageBellAndUserWrapper}>
                        <ul>
                            <li>
                                <Menu size="35" className={socialstyle.menuIcons} />
                                <div className={socialstyle.menuWrapper}>
                                    Menu
                                </div>
                            </li>
                            <li>
                                <MessageSquareMore size="35" className={socialstyle.messangerIcons} />
                                <div className={socialstyle.messangerWrapper}>
                                    Messanger
                                </div>
                            </li>
                            <li>
                                <Bell size="35" className={socialstyle.notificationsIcons} />
                                <div className={socialstyle.notificationsWrapper}>
                                    Notifications
                                </div>

                            </li>
                        </ul>
                        <img src="" alt=""  />
                    </div>
                </div>
            </div>
            <Outlet />
        </>
        
    )
}

export default Social