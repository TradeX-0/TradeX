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
          <svg className="mr-2" fill="#000000" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 219.151 219.151" xml:space="preserve">
          <g>
            <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575
              C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575
              c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z"/>
            <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008
              c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825
              c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628
              c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z"/>
          </g>
          </svg> Back
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
                  <td><Link to={`http://localhost:5173/stocks/${watch.symbol}`} className='text-blue-500'>{watch.symbol}</Link></td>
                  <td><Link to={`http://localhost:5173/stocks/${watch.symbol}`} className='text-blue-500'>{watch.longName}</Link></td>
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
