import { useEffect, useState } from 'react';
import './Stocks.css';
import { useCookies } from 'react-cookie';
import { getUser } from '../../services/auth';
import { getStocks } from '../../services/stocks';
import getSymbolFromCurrency from 'currency-symbol-map';
import Navbar from "../../components/navbar/Navbar"

function Stocks() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
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
              <th>Bought on</th>
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
                  <td>{new Date(order.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // Use 12-hour format
})}</td>
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