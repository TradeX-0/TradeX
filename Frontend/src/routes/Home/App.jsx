import { Link } from 'react-router-dom'
import './App.css'
import { getUser } from '../../services/auth'
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from "../../images/Logo.png"
import useImage from "../../images/user.png"
import { useLogout } from '../../services/auth';

function App() {
  const [user, setUser] = useState(null)
  const [cookies, removeCookie] = useCookies(['token']);
  const logout = useLogout();


    useEffect(() => {
        if (cookies.token) {
        const fetchUser = async () => {
            try {
                const userData = await getUser(cookies.token);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
    
        fetchUser();
    }
}, []);

  
  return (
    <>
      <div className="bg-[#1d232a] h-screen flex flex-col items-center justify-center text-white">
      <header className="w-full flex justify-between p-4 absolute top-0">
      <div className="flex items-center">
        <img src={logo} alt="TradeX Logo" className="w-10 mr-2" />
        <h3 className="text-lg font-semibold">TradeX</h3>
      </div>

        
      <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User Avatar"
                                src={useImage}
                            />
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
      </header>
      
      <main className="text-center max-w-lg p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-white">Welcome {user?.user_name},</h1>
          <p className="text-lg mb-8">
            We provide Real-Time Market Simulations: Experience the thrill of live trading
            with our accurate and up-to-date market data.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link to={'/stocks'} className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 text-xl transition duration-300">
            Trade
          </Link>
        </motion.div>
      </main>
    </div>
    </>
  )
}

export default App
