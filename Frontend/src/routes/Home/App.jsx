import { Link } from 'react-router-dom'
import './App.css'
import { getUser } from '../../services/auth'
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null)
  const [cookies] = useCookies(['token']);

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
      <h1>Hello</h1>
      <h1 className="text-3xl font-bold underline text-white">
        Hello {user?.user_name}
      </h1>
      <Link to={"/stocks"}>Stocks</Link>
    </>
  )
}

export default App
