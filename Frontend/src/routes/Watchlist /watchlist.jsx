import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { getUser } from "../../services/auth";
import { useCookies } from "react-cookie";
import { getwatchStocks, removestock } from "../../services/stocks";
import getSymbolFromCurrency from 'currency-symbol-map';
import { Converter } from "easy-currencies";
import { toast } from "react-toastify";

function Watchlist() {
    const [user, setUser] = useState(null);
    const [watch, setWatch] = useState([]);
    const [watchData, setWatchData] = useState([]);
    const [cookies] = useCookies(['token']);
    const [convertedprices, setConvertedPrices] = useState([]);
    const inrSymbol = getSymbolFromCurrency("INR");
    const converter = new Converter();

    // Convert prices to INR
    useEffect(() => {
        const convertPrices = async () => {
            const newConvertedPrices = {};
            for (let i = 0; i < watchData.length; i++) {
                if (watchData[i]) {
                    const priceInUSD = watchData[i].regularMarketPrice;
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

    // Fetch watchlist
    useEffect(() => {
        if (user?.id) {
            const fetchwatch = async () => {
                try {
                    const response = await getwatchStocks(user);
                    setWatch(response.length > 0 ? response : []);
                } catch (error) {
                    console.error('Error fetching watch:', error);
                }
            };
            fetchwatch();
        }
    }, [user]);

    // Fetch market data
    useEffect(() => {
        const fetchData = async () => {
            if (watch.length === 0) return;

            try {
                const symbolsObj = {};
                watch.forEach(order => {
                    if (order?.symbol) {
                        symbolsObj[order.symbol] = true;
                    }
                });

                const response = await fetch(`http://localhost:3000/api/mquotes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(symbolsObj),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setWatchData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, [watch]);

    // Handle stock removal
    const handleRemoveStock = async (symbol) => {
        try {
            await removestock(user, symbol);

            // Update the watch and watchData state without reloading
            setWatch(prevWatch => prevWatch.filter(stock => stock.symbol !== symbol));
            setWatchData(prevWatchData => prevWatchData.filter(stock => stock.symbol !== symbol));

            toast.success("Removed from Watchlist!", {
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
            console.error('Error removing stock:', error);
            toast.error("Failed to remove from Watchlist.", {
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
            {watch.length > 0 && (
              <p className="ml-8 text-lg text-neutral-500">
                  Updated on {new Date(watch[watch.length - 1]?.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  })}
              </p>
            )}
            <br />
            <table className="table table-fixed w-full">
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
                      watchData.map((watchItem, index) => (
                          <tr key={watchItem.id || `${watchItem.symbol}-${index}`}>
                              <td>{index + 1}</td>
                              <td><Link to={`/stocks/${watchItem.symbol}`} className='text-blue-500'>{watchItem.symbol}</Link></td>
                              <td><Link to={`/stocks/${watchItem.symbol}`} className='text-blue-500'>{watchItem.longName}</Link></td>
                              <td>{inrSymbol}{convertedprices[index] ? (convertedprices[index]).toFixed(2) : "Null"}</td>
                              <td><a className={watchItem.regularMarketChangePercent > 0 ? "bg-green-800 text-green-400 font-semibold px-2 py-1 rounded w-8" : "bg-red-800 text-orange-400 font-semibold px-2 py-1 rounded w-8"}>{watchItem.regularMarketChangePercent > 0 ? "+" : ""}{(watchItem.regularMarketChangePercent).toFixed(2)}%</a></td>
                              <td>{watchItem.averageAnalystRating ? watchItem.averageAnalystRating : <p className="ml-8">-</p>}</td>
                              <td>{watchItem.regularMarketVolume}</td>
                              <td><button className="underline text-red-500" onClick={() => handleRemoveStock(watchItem.symbol)}>Remove</button></td>
                          </tr>
                      ))
                  )}
              </tbody>
          </table>

      </>
  );
}

export default Watchlist;