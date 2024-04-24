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
                        <Home className={socialstyle.icons} />
                        <Video className={socialstyle.icons} />
                        <UsersRound className={socialstyle.icons} />
                    </div>
                    <div className={socialstyle.menuMessageBellAndUserWrapper}>
                        <Menu size="35" className={socialstyle.icons} />
                        <MessageSquareMore size="35" className={socialstyle.icons} />
                        <Bell size="35" className={socialstyle.icons} />
                        <img src="" alt=""  />
                    </div>
                </div>
            </div>
            <Outlet />
        </>
        
    )
}

export default Social