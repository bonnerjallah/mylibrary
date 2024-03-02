import { useAuth } from './AuthContext';
import { Outlet } from 'react-router-dom';

import LoginForm from '../pages/LoginForm';

const ProtectedRoutes = () => {
    const { loggedIn } = useAuth();
    return (
        <div>
            {loggedIn ? (
                <Outlet />
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

export default ProtectedRoutes;