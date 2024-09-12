import Search from '../../components/search/Search';
import { useEffect, useState } from 'react';
import './Stocks.css';
import { useCookies } from 'react-cookie';
import { getUser } from '../../services/auth';
import { getStocks } from '../../services/stocks';
import getSymbolFromCurrency from 'currency-symbol-map';
import userImage from "../../images/user.png"
import { useLogout } from '../../services/auth';
import logo from "../../images/Logo.png"
import Navbar from "../../components/navbar/Navbar"

function Stocks() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);
  const logout = useLogout()

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
  }, [cookies.token]); // Added dependency to re-fetch user when token changes

  useEffect(() => {
    if (user?.id) { // Ensure user is defined and has an ID
      const fetchOrders = async () => {
        try {
          const response = await getStocks(user);
          if(response.length === 0){
            setOrders([]);
          }
          else{
            setOrders(response);
          }
        } catch (error) {
          console.error('Error fetching orders:', error); // Log any errors
        }
      };

      fetchOrders();
    }
  }, [user]); // Added user as a dependency to fetch orders when user changes
  const inrSymbol = getSymbolFromCurrency("INR");

  return (
    <>
    <Navbar />
      <br />
      <br />
      <div className="flex justify-center">
        <div className="stats shadow border border-white w-[400px] p-4">
          <div className="stat">
            <div className="stat-title">Wallet</div>
            <div className="stat-value">~ {inrSymbol}{user?.wallet}</div>
          </div>  
        </div>
      </div>

      <br />
      <br />
      <h3>Portfolio</h3>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr> 
              <th>#</th>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No Stocks found.</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.stock_name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.stock_price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Stocks;
