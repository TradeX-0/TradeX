import './Stock.css';
import Chart from '../../../components/graph/Charts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../../components/navbar/Navbar";
import getSymbolFromCurrency from 'currency-symbol-map';
import { Converter } from "easy-currencies";
import { addstock, getStocks, getwatchStocks, removestock } from '../../../services/stocks';
import { getUser } from '../../../services/auth';
import { buy, sell  } from '../../../services/functioning';
import { close } from '../../../services/functioning';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

function Stock() {
  const [data, setData] = useState(null);
  const [price, setPrice] = useState(null);
  const [inrPrice, setInrPrice] = useState(null);
  const [message, setMessage] = useState("")
  const [quantity, setQuantity] = useState("")
  const [user, setUser] = useState(null);
  const [order, setOrders] = useState([]);
  const [interval, setInterval] = useState('5m')
  const [watch, setWatch] = useState([])
  const [watchlist, setWatchList] = useState(false)
  const [cookies] = useCookies(['token']);
  const converter = new Converter();

  const { stock } = useParams();

  useEffect(() => {
    if (user?.id) { // Ensure user is defined and has an ID
      const fetchwatch = async () => {
        try {
          const response = await getwatchStocks(user);
          setWatch(response.length > 0 ? response : []);
        } catch (error) {
          console.error('Error fetching watch:', error); // Log any errors
        }
      };

      fetchwatch();
    }
  }, [user, watch]);

  useEffect(()=>{
    if(quantity <1){
      setMessage("The minimum quantity for this stock is 1")
    }
    else if(user?.wallet - (quantity*inrPrice) < 0){
      setMessage("You dont have enough Balance")
    }
  }, [quantity])
  

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

  const handleBuyStock = async () => {
    if (user?.id && quantity > 0) {
      let balance = user?.wallet - (quantity*inrPrice)
      try {
        const response = await buy(data.symbol, data.shortName, quantity, inrPrice, user.id, balance);
        toast.success("Purchase successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setUser(prevUser => ({ ...prevUser, wallet: balance }));
        setQuantity("")
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleSellStock = async () => {
    if (user?.id && quantity > 0) {
      let balance = user.wallet - (quantity * inrPrice);
      try {
        const response = await sell(data.symbol, quantity, inrPrice, user.id, balance);
        toast.success("Purchase successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // Example: Update state instead of reloading
        setUser(prevUser => ({ ...prevUser, wallet: balance }));
        
        setQuantity("")
      } catch (error) {
        console.error(error);
        toast.error("Purchase failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  }
  const Handleclose = async () => {
    if (user?.id) {
      const userStock = order.find(item => item.stock_name === stock);
      if(userStock){
        let balance = user?.wallet + (userStock.stock_price * userStock.quantity) + calculateProfitLoss()
        try {
          const response = await close(data.symbol, user.id, balance, data.shortName, userStock.quantity, userStock.stock_price, inrPrice, userStock.type);
          toast.success("Closed successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setQuantity("")
          setUser(prevUser => ({ ...prevUser, wallet: balance }));
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    if (user?.id) { // Ensure user is defined and has an ID
      const fetchstock = async () => {
        try {
          const response = await getStocks(user);
          setOrders(response);
        } catch (error) {
          console.error('Error fetching orders:', error); // Log any errors
        }
      };

      fetchstock();
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

  useEffect(()=>{
    
  })

  const symbol = getSymbolFromCurrency(data?.currency);
  const inrSymbol = getSymbolFromCurrency("INR");
  const handleKeypress = (e) => {
    const characterCode = e.key
    if (characterCode === 'Backspace') return

    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return
      } else if (characterNumber === 0) {
        e.preventDefault()
      }
    } else {
      e.preventDefault()
    }
    
  }
  const handleAddStock = async () => {
    try {
        await addstock(user, data?.symbol);
        // Update watch state by adding the new stock
        setWatch(prevWatch => [...prevWatch, { id: user.id, symbol: data.symbolv}]); // Adjust based on your stock structure
        toast.success("Added to Watchlist!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    } catch (error) {
        console.error('Error adding stock:', error);
        toast.error("Failed to add to Watchlist.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
};

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
  
  useEffect(() => {
    if (data && watch.length > 0) {
      const isInWatchlist = watch.some(item => item.symbol === data.symbol);
      setWatchList(isInWatchlist);
    }
  }, [data, watch]);

  return (
    <>
      <Navbar />
      
      <Link 
          to="/dashboard" 
          className="p-2 ml-4 text-lg font-semibold bg-base-300 text-white rounded-lg shadow hover:bg-base-200 transition duration-300 ease-in-out inline-flex items-center"
        >
          {"<"} Back
        </Link>

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
            <div className="stat-value">{inrSymbol}{user?.wallet ? (user.wallet).toFixed(2): ""}</div>
          </div>
        </div>
      </div>

      <div className='flex-container'>
        <div className='chart-container'>
         <label className="form-control ml-5 w-75px absolute z-50">
            <select className="select select-bordered" onChange={e=>{
              setInterval(e.target.value)
            }}>
              <option defaultValue={'5m'}>5m</option>
              <option>1m</option>
              <option>15m</option>
              <option>1h</option>
              <option>1d</option>
            </select>
          </label>
          <Chart interval={interval}/>
        </div>
        <div className='buy-sell-box'>
            <div>
              <div className='flex justify-between'>
                <h2 className='flex-none text-xl font-bold'>{data?.symbol}</h2>
                {watchlist ? <button onClick={async()=>{
                  await removestock(user, data?.symbol)
                  setWatch(prevWatch => ({ ...prevWatch }));
                  toast.error("Removed from Watchlist!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                }}>Remove from Watchlist</button> : <button onClick={handleAddStock}>Add to Watchlist</button>}
              </div>
              <div className='divider'></div>
            </div>
            <div>
            <div className='flex flex-col justify-center border rounded-lg'>
              <p className='text-center'>Analyst Rating</p>
              <p className='text-center font-bold'>{data?.averageAnalystRating}</p>
            </div>
            <div className='flex m-4'>
              <p className='mt-4'>Market Volume</p>
              <button className='border border-neutral-700 w-32 rounded-lg text-base font-semibold ml-32 mt-4'>{data?.regularMarketVolume}</button>
            </div>
            <div className='flex justify-center space-x-12'>
              <div className='flex flex-col items-center'>
                <p className='text-base font-medium'>Daily Low</p>
                <button className='border border-neutral-700  text-base font-semibold mt-2 px-6 py-2 rounded-lg shadow-lg w-40'>
                  {symbol} {data?.regularMarketDayRange.low}
                </button>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-base font-medium'>Daily High</p>
                <button className='border border-neutral-700  text-base font-semibold mt-2 px-6 py-2 rounded-lg shadow-lg w-40'>
                  {symbol} {data?.regularMarketDayRange.high}
                </button>
              </div>
            </div>
            </div>
            <div>
            <div className='divider mt-8'></div>
            {order.some(item => item.stock_name === stock) ? 
              <>
              {profitLoss !== null && (
                <>
                  {order.find(item => item.stock_name === stock)?.type === "SELL" ? (
                    <div className="flex justift-between items-center">
                      <p className={`text-lg`}>
                        P&L
                      </p>
                      <button className={`btn btn-active w-56 ml-32 font-semibold text-lg ${profitLoss >= 0 ? 'text-red-500' : 'text-green-400'}`}>
                      {profitLoss < 0 ? '+' : '-'}{inrSymbol}{Math.abs(profitLoss).toFixed(2)}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className={`text-lg`}>
                        P&L
                      </p>
                      <button className={`btn btn-active w-56 text-lg font-semibold ml-32 ${profitLoss >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        {profitLoss >= 0 ? '+' : '-'}{inrSymbol}{Math.abs(profitLoss).toFixed(2)}
                      </button>
                    </div>
                  )}
                </>
              )}
              
              <div className="button-container flex justify-center mt-4">
                <button className="btn btn-outline btn-error sell-button" onClick={Handleclose}>
                  Close
                </button>
              </div>
            </>
            
             : 
              <>
                <p>You do not own this stock.</p>
                <div className='button-container'>
                  <button className="btn btn-outline btn-success buy-button" onClick={()=>document.getElementById('buy_modal').showModal()}>BUY</button>
                    <dialog id="buy_modal" className="modal" onClose={() => setQuantity('')}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-8">{data?.shortName}</h3>
                        <div className="flex justify-between">
                          <p className='mt-4'>Quantity</p>
                          <div>
                          <input type="number" max="5" placeholder="Qty" className="input input-bordered w-40 h-12 max-w-xs" onChange={e =>{
                            setQuantity(e.target.value)
                          }}
                          value={quantity}
                          onKeyDown={handleKeypress} 
                          min='1' 
                          step='1'
                          />
                          <p className='text-neutral-500 text-sm mt-1'>Maximum Quantity: {Math.floor(user?.wallet/inrPrice)}</p>
                          </div>
                        </div>
                        <div className="flex justify-between mt-4">
                          <p className='mt-4'>Market price</p>
                          <button className='btn btn-wide w-40 h-12'>{inrSymbol}{Math.round(inrPrice * 100) / 100}</button>
                        </div>
                        {(quantity < 1) || (user?.wallet - (quantity*inrPrice) < 0) ? <button className="btn btn-error w-[450px] mt-24 flex items-center">
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
                          <span>{message}</span>
                        </button> : <div className="flex justify-between mt-36"></div>}
                        <div className="divider"></div>
                        <div className="flex justify-between pb-2">
                          <p>Balance: {inrSymbol}{user?.wallet}</p>
                          <p>required: {inrSymbol}{(quantity * inrPrice).toFixed(2)}</p>
                        </div>
                        <div className='flex justify-center'>
                          <button
                            className="btn btn-outline btn-success buy-button"
                            onClick={handleBuyStock}
                            disabled={quantity < 1 || (user?.wallet - (quantity*inrPrice)) < 0}
                          >
                            Buy
                          </button>
                        </div>
                        <p className='font-thin'>Press ESC key or click outside to close</p>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                    <button className="btn btn-outline btn-error sell-button" onClick={()=>document.getElementById('sell_modal').showModal()}>SELL</button>
                    <dialog id="sell_modal" className="modal" onClose={() => setQuantity('')}>
                      <div className="modal-box">
                        <h3 className="font-bold text-lg mb-8">{data?.shortName}</h3>
                        <div className="flex justify-between">
                          <p className='mt-4'>Quantity</p>
                          <div>
                          <input type="number" max="5" placeholder="Qty" className="input input-bordered w-40 h-12 max-w-xs" onChange={e =>{
                            setQuantity(e.target.value)
                          }}
                          value={quantity}
                          onKeyDown={handleKeypress} 
                          min='1' 
                          step='1'
                          />
                          <p className='text-neutral-500 text-sm mt-1'>Maximum Quantity: {Math.floor(user?.wallet/inrPrice)}</p>
                          </div>
                        </div>
                        <div className="flex justify-between mt-4">
                          <p className='mt-4'>Market price</p>
                          <button className='btn btn-wide w-40 h-12'>{inrSymbol}{Math.round(inrPrice * 100) / 100}</button>
                        </div>
                        {(quantity < 1) || ((user?.wallet - (quantity*inrPrice)) < 0) ? <button className="btn btn-error w-[450px] mt-24 flex items-center">
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
                          <span>{message}</span>
                        </button> : <div className="flex justify-between mt-36"></div>}
                        <div className="divider"></div>
                        <div className="flex justify-between pb-2">
                          <p>Balance: {inrSymbol}{user?.wallet}</p>
                          <p>required: {inrSymbol}{(Math.round(quantity * inrPrice * 100) / 100)}</p>
                        </div>
                        <div className='flex justify-center'>
                        <button
                            className="btn btn-outline btn-error buy-button"
                            onClick={handleSellStock}
                            disabled={quantity < 1 || (user?.wallet - (quantity*inrPrice)) < 0}
                          >
                            Sell
                          </button>
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
      </div>
    </>
    
  );
}

export default Stock;