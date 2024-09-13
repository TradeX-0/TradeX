import './Stock.css';
import Chart from '../../../components/graph/Charts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../../components/navbar/Navbar";
import getSymbolFromCurrency from 'currency-symbol-map';
import { Converter } from "easy-currencies";
import { getStocks } from '../../../services/stocks';
import { getUser } from '../../../services/auth';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

function Stock() {
  const [data, setData] = useState(null);
  const [price, setPrice] = useState(null);
  const [inrPrice, setInrPrice] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [user, setUser] = useState(null);
  const [order, setOrders] = useState([]);
  const [cookies] = useCookies(['token']);
  const converter = new Converter();

  const { stock } = useParams();

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

  useEffect(() => {
    if (user?.id) { // Ensure user is defined and has an ID
      const fetchOrders = async () => {
        try {
          const response = await getStocks(user);
          setOrders(response);
        } catch (error) {
          console.error('Error fetching orders:', error); // Log any errors
        }
      };

      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/quotes/${stock}`);
        const result = await response.json();

        setData(result);
        
        // Convert price to INR
        const conversionResult = await converter.convert(result.regularMarketPrice, result.currency, "INR");
        setInrPrice(conversionResult);
        if(result.currency != "INR"){
          setPrice(result.regularMarketPrice);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }); // Added stock as a dependency to avoid infinite loop

  const symbol = getSymbolFromCurrency(data?.currency);
  const inrSymbol = getSymbolFromCurrency("INR");

  // Calculate profit/loss
  const calculateProfitLoss = () => {
    const userStock = order.find(item => item.stock_name === stock);
    if (userStock) {
      const purchasePrice = userStock.stock_price; // Assuming you have the purchase price in the order data
      const quantityOwned = userStock.quantity; // Assuming you have the quantity in the order data
      const currentPrice = inrPrice; // Current market price

      if (currentPrice && purchasePrice) {
        const profitLoss = (currentPrice - purchasePrice) * quantityOwned;
        return profitLoss;
      }
    }
    return null; // No stock found or prices not available
  };

  const profitLoss = calculateProfitLoss();

  return (
    <>
      <Navbar />
      
      <Link to={"/stocks"} className="mr-4">back</Link>

      <div className="flex justify-between items-start space-x-4">
        {data == null ? 
        <p className='loading'>Loading..</p> : 
          <div className="stats shadow data">
          <div className="stat">
            <div className="stat-title">{data?.shortName} ({data?.symbol})</div>
            <div className="stat-value">~ {inrSymbol}{Math.round(inrPrice * 100) / 100} 
            {price ? <> ({symbol}{Math.round(price * 100) / 100})</> : <></>}</div>
          </div>
        </div>
      }
        <div className="stats shadow border border-white w-[350px] p-4">
          <div className="stat">
            <div className="stat-title">Wallet</div>
            <div className="stat-value">{inrSymbol}{user?.wallet}</div>
          </div>
        </div>
      </div>

      <div className='flex-container'>
        <div className='chart-container'>
          <Chart />
        </div>
        <div className='buy-sell-box'>
          
            {order.some(item => item.stock_name === stock) ? 
              <>
                {profitLoss !== null && (
                  <p>{profitLoss >= 0 ? 'Profit: ' : 'Loss: '}{inrSymbol}{Math.abs(profitLoss).toFixed(2)}</p>
                )}
                <p>You have {order.find(item => item.stock_name === stock)?.quantity} stocks to sell.</p>
                <div className='button-container justify-center'>
                  <button className='sell-button'>Close</button>
                </div>
              </>
             : 
              <>
                <div className='quantity-input'>
                  <input 
                    type='number' 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    min="1" 
                    placeholder='Quantity' 
                    className='input input-bordered'
                  />
                </div>
                <p>You do not own this stock.</p>
                <div className='button-container'>
                  <button className='buy-button'>Buy</button>
                  <button className='sell-button'>Sell</button>
                </div>
              </>
            }
          
        </div>
      </div>
    </>
  );
}

export default Stock;