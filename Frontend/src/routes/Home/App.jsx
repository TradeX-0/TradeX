import { Link } from 'react-router-dom';
import { getUser } from '../../services/auth';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from "../../images/Logo.png";
import userImage from "../../images/user.png";
import backgroundImage from "../../images/finance.jpg"; // Import the background image
import { useLogout } from '../../services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);
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
  }, [cookies.token]);

  return (
    <>
      <div
        className="h-screen flex flex-col items-center justify-center text-white relative"
      >
        {/* Background Image Div */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center filter blur-sm"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>

        {/* Overlay Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-25">
          <header className="w-full flex justify-between p-4 absolute top-0">
            <div className="flex-1 flex-row items-center">
              <img src={logo} alt="TradeX Logo" className="w-10 mr-2" />
              <h3 className="text-lg font-semibold">TradeX</h3>
            </div>
            
            <p className="mr-4 mt-4">{user?.user_name}</p>
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
                            <Link to={"/watchlist"} className="justify-between">
                                Watchlist
                                <span className="badge">New</span>
                            </Link>
                        </li>
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
              <Link
                to={'/dashboard'}
                className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 text-xl transition duration-300"
              >
                Trade
              </Link>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
