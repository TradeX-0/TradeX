import { useState, useEffect } from 'react';
import Search from "../search/Search";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from '../../services/auth.js';
import { useCookies } from 'react-cookie';
import userImage from "../../images/user.png"

function Navbar() {
    const [user, setUser] = useState(null);
    const [cookies, removeCookie] = useCookies(['token']);
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        const fetchUser = async () => {
            if (cookies.token) {
                try {
                    const userData = await getUser(cookies.token);
                    setUser(userData);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
    }, [cookies.token]);

    const logout = () => {
        removeCookie('token', {path: '/'}); // Correctly remove the token using the key
        navigate('/login'); // Redirect to the login page after logout
    };

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Search />
            </div>
            <p className="mr-4">{user?.user_name}</p>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="avatar online">
                        <div className="w-12 h-16 rounded-full overflow-hidden">
                            <img 
                            src={userImage} 
                            className="w-full h-full object-cover -mt-2" // Adjust -mt-2 as needed
                            />
                        </div>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a onClick={logout}>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;