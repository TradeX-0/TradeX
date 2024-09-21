import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { getUser } from "../../services/auth";
import { useCookies } from "react-cookie";
import { getwatchStocks, removestock } from "../../services/stocks";
import getSymbolFromCurrency from 'currency-symbol-map';
import { Converter } from "easy-currencies";

function Watchlist() {
    const [user, setUser] = useState(null)
    const [watch, setWatch] = useState([])
    const [watchData, setWatchData] = useState([])
    const [cookies] = useCookies(['token']);
    const [convertedprices, setConvertedPrices] = useState([])
    const inrSymbol = getSymbolFromCurrency("INR");
    const converter = new Converter
    
    useEffect(() => {
        const convertPrices = async () => {
          const newConvertedPrices = {};
    
          for (let i = 0; i < watchData.length; i++) {
            if (watchData[i]) {  // Use index instead of stock_name
              const priceInUSD = watchData[i].regularMarketPrice; // Fetch market price using index
              // Convert price to INR
              try {
                const convertedPrice = await converter.convert(priceInUSD, watchData[i].currency, 'INR');
                newConvertedPrices[i] = convertedPrice;
                
    
              } catch (error) {
                console.error(`Error converting price for index ${i}:`, error);
                newConvertedPrices[i] = null; // Set to null if conversion fails
              }
            }
          }
    
          setConvertedPrices(newConvertedPrices);
        };
    
        convertPrices();
      }, [watchData]);

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
      }, [user]);

      

      useEffect(() => {
        const fetchData = async () => {
          if (watch.length === 0) return; // Prevent fetching if there are no watch
    
          try {
            // Create an object of stock names from watch
            const symbolsObj = {};
            watch.forEach(order => {
              if (order?.symbol) {
                symbolsObj[order.symbol] = true; // Set the value to true for each symbol
              }
            });
    
            const response = await fetch(`https://tradex-101.onrender.com/api/mquotes`, {
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
            setWatchData(result); // Store market prices in state
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
      
        return () => clearInterval(intervalId);
      }, [watch]);



  return (
    <>
        <Navbar />
        <Link 
          to="/dashboard" 
          className="p-2 ml-4 text-lg font-semibold bg-base-300 text-white rounded-lg shadow hover:bg-base-200 transition duration-300 ease-in-out inline-flex items-center"
        >
          {'<'} Back
        </Link>

        <br />
        <h2 className="text-3xl font-bold ml-8 mt-8 text-white">My Watchlist</h2>
        <p className="ml-8 text-lg text-neutral-500">{watchData.length} Stocks</p>
        {watch.length > 0 && <p className="ml-8 text-lg text-neutral-500">Updated on {new Date(watch[watch.length - 1]?.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  })}</p>}
        <br />
        <table className="table">
          <thead>
            <tr> 
              <th></th>
              <th>Symbol</th>
              <th>Stock Name</th>
              <th>Price</th>
              <th>% Change</th>
              <th>Analyst Rating</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {watchData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No Stocks found.</td>
              </tr>
            ) : (
              watchData.map((watch, index) => (
                  <tr key={watch.id || `${watch.symbol}-${index}`}>
                  <td>{index + 1}</td>
                  <td><Link to={`/stocks/${watch.symbol}`} className='text-blue-500'>{watch.symbol}</Link></td>
                  <td><Link to={`/stocks/${watch.symbol}`} className='text-blue-500'>{watch.longName}</Link></td>
                  <td>{inrSymbol}{convertedprices[index] ? (convertedprices[index]).toFixed(2) : "Null"}</td>
                  <td><a className={watch.regularMarketChangePercent > 0 ? "bg-green-800 text-green-400 font-semibold px-2 py-1 rounded w-8" : "bg-red-800 text-orange-400 font-semibold px-2 py-1 rounded w-8"}>{watch.regularMarketChangePercent > 0 ? "+" : ""}{(watch.regularMarketChangePercent).toFixed(2)}%</a></td>
                  <td>{watch.averageAnalystRating ? watch.averageAnalystRating : <p className="ml-8">-</p>}</td>
                  <td>{watch.regularMarketVolume}</td>
                  <td><button className="underline text-red-500" onClick={
                    async()=>{
                        await removestock(user, watch.symbol)
                        window.location.reload()
                    }
                  }>Remove</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

    </>
  );
}

export default Watchlist;
