import { Outlet} from "react-router-dom"
import { useAuth } from "./AuthContext"

import UserLogin from "../pages/UserLogin"

const ProtectedRoutes = () => {
    const {loggedIn} = useAuth()
    return (
        <div>
            {loggedIn ? (
                <Outlet />
            ): (
                <UserLogin />
            )}
        </div>
    )
}

export default ProtectedRoutes