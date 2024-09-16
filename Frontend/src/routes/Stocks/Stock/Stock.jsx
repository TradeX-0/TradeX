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
  const [quantity, setQuantity] = useState(0)
  const [user, setUser] = useState(null);
  const [order, setOrders] = useState([]);
  const [interval, setInterval] = useState('5m')
  const [cookies] = useCookies(['token']);
  const converter = new Converter();

  const { stock } = useParams();

  const buy = ()=> {
      if(user){
        if(user.wallet - (quantity * inrPrice) < 0){
          console.log("hi")
        }
      }
    }

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
         <label className="form-control ml-5 w-75px absolute z-50">
            <select className="select select-bordered" onChange={e=>{
              setInterval(e.target.value)
            }}>
              <option>1m</option>
              <option>5m</option>
              <option>15m</option>
              <option>1h</option>
              <option>1d</option>
            </select>
          </label>
          <Chart interval={interval}/>
        </div>
        <div className='buy-sell-box'>
          
            {order.some(item => item.stock_name === stock) ? 
              <>
                {profitLoss !== null && (
                  <p>{profitLoss >= 0 ? 'Profit: ' : 'Loss: '}{inrSymbol}{Math.abs(profitLoss).toFixed(2)}</p>
                )}
                <p>You have {order.find(item => item.stock_name === stock)?.quantity} stocks to sell.</p>
                <div className='button-container justify-center'>
                  <button className='btn btn-outline btn-error sell-button'>Close</button>
                </div>
              </>
             : 
              <>
                <p>You do not own this stock.</p>
                <div className='button-container'>
                  <button className="btn btn-outline btn-success buy-button" onClick={()=>document.getElementById('buy_modal').showModal()}>BUY</button>
                    <dialog id="buy_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-8">{data?.shortName}</h3>
                        <div className="flex justify-between">
                          <p className='mt-4'>Quantity</p>
                          <input type="number" max="5" placeholder="Qty" className="input input-bordered w-40 h-12 max-w-xs" onChange={e =>{
                            setQuantity(e.target.value)
                          }}/>
                        </div>
                        <div className="flex justify-between mt-4">
                          <p className='mt-4'>Market price</p>
                          <button className='btn btn-wide w-40 h-12'>{inrSymbol}{Math.round(inrPrice * 100) / 100}</button>
                        </div>
                        <button className="btn btn-error w-[450px] mt-24 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current mr-2" // Added margin-right for spacing
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>The minimum Quantity for this stock is 1</span>
                        </button>
                        <div className="divider"></div>
                        <div className="flex justify-between pb-2">
                          <p>Balance: {inrSymbol}{user?.wallet}</p>
                          <p>required: {inrSymbol}{quantity * (Math.round(inrPrice * 100) / 100)}</p>
                        </div>
                        <div className='flex justify-center'>
                          <button className="btn btn-outline btn-success sell-button" onSubmit={buy()}>Buy</button>
                        </div>
                        <p className='font-thin'>Press ESC key or click outside to close</p>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                    <button className="btn btn-outline btn-error sell-button" onClick={()=>document.getElementById('sell_modal').showModal()}>SELL</button>
                    <dialog id="sell_modal" className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg mb-8">{data?.shortName}</h3>
                        <div className="flex justify-between">
                          <p className='mt-4'>Quantity</p>
                          <input type="number" max="5" placeholder="Qty" className="input input-bordered w-40 h-12 max-w-xs" onChange={e =>{
                            setQuantity(e.target.value)
                          }}/>
                        </div>
                        <div className="flex justify-between mt-4">
                          <p className='mt-4'>Market price</p>
                          <button className='btn btn-wide w-40 h-12'>{inrSymbol}{Math.round(inrPrice * 100) / 100}</button>
                        </div>
                        <button className="btn btn-error w-[450px] mt-24 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current mr-2" // Added margin-right for spacing
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>The minimum Quantity for this stock is 1</span>
                        </button>
                        <div className="divider"></div>
                        <div className="flex justify-between pb-2">
                          <p>Balance: {inrSymbol}{user?.wallet}</p>
                          <p>required: {inrSymbol}{(Math.round(quantity * inrPrice * 100) / 100)}</p>
                        </div>
                        <div className='flex justify-center'>
                          <button className="btn btn-outline btn-error sell-button">Sell</button>
                        </div>
                        <p className='font-thin'>Press ESC key or click outside to close</p>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                </div>
              </>
            }
          
        </div>
      </div>
    </>
  );
}

export default Stock;