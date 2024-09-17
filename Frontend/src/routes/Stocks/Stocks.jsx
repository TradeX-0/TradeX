import { useEffect, useState } from 'react';
import './Stocks.css';
import { useCookies } from 'react-cookie';
import { getUser } from '../../services/auth';
import { getStocks } from '../../services/stocks';
import getSymbolFromCurrency from 'currency-symbol-map';
import Navbar from "../../components/navbar/Navbar";
import { Converter } from 'easy-currencies'; 

function Stocks() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);
  const inrSymbol = getSymbolFromCurrency("INR");
  const [marketPrices, setMarketPrices] = useState({});
  const converter = new Converter();
  const [convertedPrices, setConvertedPrices] = useState({});
  const [totalPL, setTotalPL] = useState(0); // State for storing the total P&L

  // Fetch market prices and convert them to INR
  useEffect(() => {
    const convertPrices = async () => {
      const newConvertedPrices = {};
      let cumulativePL = 0; // Initialize total P&L to 0

      for (let i = 0; i < marketPrices.length; i++) {
        if (marketPrices[i]) {  // Use index instead of stock_name
          const priceInUSD = marketPrices[i].regularMarketPrice; // Fetch market price using index
          // Convert price to INR
          try {
            const convertedPrice = await converter.convert(priceInUSD, marketPrices[i].currency, 'INR');
            newConvertedPrices[i] = convertedPrice;

            // Calculate individual P&L and add it to cumulative P&L
            const order = orders[i]; 
            const individualPL = (convertedPrice - order.stock_price) * order.quantity;
            cumulativePL += individualPL; // Add this stock's P&L to the total

          } catch (error) {
            console.error(`Error converting price for index ${i}:`, error);
            newConvertedPrices[i] = null; // Set to null if conversion fails
          }
        }
      }

      setConvertedPrices(newConvertedPrices);
      setTotalPL(cumulativePL); // Set the total P&L
    };

    convertPrices();
  }, [marketPrices, orders]);

  // Fetch market data for stocks
  useEffect(() => {
    const fetchData = async () => {
      if (orders.length === 0) return; // Prevent fetching if there are no orders

      try {
        // Create an object of stock names from orders
        const symbolsObj = {};
        orders.forEach(order => {
          if (order?.stock_name) {
            symbolsObj[order.stock_name] = true; // Set the value to true for each symbol
          }
        });

        const response = await fetch(`http://localhost:3000/api/mquotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(symbolsObj), // Send symbols as JSON
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Market Prices:', result); // Debugging line to check fetched market prices
        setMarketPrices(result); // Store market prices in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
  
    return () => clearInterval(intervalId);
  }, [orders]);

  // Fetch user data
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

  // Fetch user's stock orders
  useEffect(() => {
    if (user?.id) { // Ensure user is defined and has an ID
      const fetchOrders = async () => {
        try {
          const response = await getStocks(user);
          setOrders(response.length > 0 ? response : []);
        } catch (error) {
          console.error('Error fetching orders:', error); // Log any errors
        }
      };

      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="flex justify-center gap-x-24">
        <div className="stats shadow border border-white w-[400px] p-4">
          <div className="stat">
            <div className="stat-title">Wallet</div>
            <div className="stat-value">{inrSymbol}{user?.wallet}</div>
          </div>  
        </div>
        <div className="stats shadow border border-white w-[400px] p-4">
          <div className="stat">
            <div className="stat-title">P&L</div>
            <div className={`stat-value ${totalPL >= 0 ? 'text-green-500' : 'text-orange-600'}`}>
            {totalPL >= 0 ? '+' : '-'}{inrSymbol}{Math.abs(totalPL).toFixed(2)} {/* Display the total P&L */}
            </div>
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
              <th>Bought on</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th className='pl-column'>P&L</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No Stocks found.</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.stock_name}</td>
                  <td>{new Date(order.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  })}
                  </td>
                  <td className={order.type === "BUY" ? 'text-green-500' : 'text-orange-600'}>
                    {order.type}
                  </td>
                  <td>{order.quantity}</td>
                  <td>{inrSymbol}{order.stock_price}</td>
                  <td className={`pl-column ${
                    order.type === "BUY" ?
                    ((convertedPrices[index] - order.stock_price) * order.quantity).toFixed(2) >= 0 ? 'text-green-500' : 'text-orange-600'
                  :
                    ((convertedPrices[index] - order.stock_price) * order.quantity).toFixed(2) < 0 ? 'text-orange-600' : 'text-green-500'
                  }`}>
                    {order.type === "BUY" ? ((convertedPrices[index] - order.stock_price) * order.quantity).toFixed(2) >= 0 ? '+' : '-'
                  :
                    ((convertedPrices[index] - order.stock_price) * order.quantity).toFixed(2) < 0 ? '-' : '+'}{inrSymbol}{Math.abs((convertedPrices[index] - order.stock_price) * order.quantity).toFixed(2)}
                  </td>
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
