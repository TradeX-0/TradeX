import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCookies } from "react-cookie";
import { getUser } from '../services/auth';

const AuthRoutes = () => {
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (cookies.token) {
                try {
                    const data = await getUser(cookies.token);
                    setUser(data);
                } catch (error) {

                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [cookies.token]);

    if (loading) {
        return <div>Loading...</div>; // Optional: Show a loading state while checking authentication
    }

    return !user  ? <Outlet /> : <Navigate to='/' />;
};

export default AuthRoutes;