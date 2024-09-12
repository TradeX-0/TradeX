import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [removeCookie] = useCookies(['token']);
  const navigate = useNavigate();

  const logout = () => {
    removeCookie('token', null, {path: '/'}); // Correctly remove the token cookie
    navigate('/login'); // Redirect to the login page after logout
  };

  return logout;
};

export const getUser = async(token) => {
    if (!token) return null;

    try {
        const user = await fetch(`http://localhost:3000/api/getuser/${token}`);
        return user.json()
    } catch (error) {
        return null; // Return null if token verification fails
    }
    
}


