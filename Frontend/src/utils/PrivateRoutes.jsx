import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCookies } from "react-cookie";
import { getUser } from '../services/auth';

const PrivateRoutes = () => {
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
                    toast.error('Session expired. Please log in again.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [cookies.token]);

    if (loading) {
        return <div>Loading...</div>; // Optional: Show a loading state while checking authentication
    }
    if(user){
        if(!user.email_Verified){
            return <Navigate to='/verify' />;
        }
    }

    return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoutes;