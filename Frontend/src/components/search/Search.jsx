import { useEffect, useState } from "react";
import "./search.css";

function Search() {
    const [dat, setData] = useState("");
    const [com, setCom] = useState([]);
    const [visible, setVisible] = useState(false);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setTimeout(() => {
            setVisible(false);
        }, 100);
    };

    const clear = () => {
        setCom([]);
        setData("");
    };

    const handleLinkClick = (symbol) => {
        clear();
        window.location.href = `/stocks/${symbol}`; 
    };

    useEffect(() => {
        const controller = new AbortController(); // Create a new AbortController instance
        const signal = controller.signal; // Get the signal from the controller

        const fetchData = async () => {
            if (dat.trim() !== "") {
                try {
                    const response = await fetch(`https://trade-x-ux6n.vercel.app/api/autoc/${dat}`, { signal });
                    const result = await response.json();
                    const quotes = result.quotes || [];
                    setCom(quotes);
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('Fetch request was aborted');
                    } else {
                        console.error('Error fetching data:', error);
                    }
                }
            } else {
                clear();
            }
        };

        const debounceTimeout = setTimeout(() => {
            fetchData();
        }, 300); // Debounce for 500ms

        return () => {
            clearTimeout(debounceTimeout); // Cleanup timeout on unmount or dat change
            controller.abort(); // Abort the fetch request if it is still ongoing
        };
    }, [dat]); // Only run effect when dat changes

    return (
        <>
            <div onFocus={show}>
            <label className="input input-bordered flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search for stocks"
                    className="grow"
                    onChange={(e) => setData(e.target.value)}
                    value={dat}
                    onBlur={hide}
                    aria-label="Search for stocks"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd" />
                </svg>
                </label>
                {visible && (
                    <div className='results text' aria-live="polite">
                        {com.length > 0 ? (
                            com.map((item, index) =>
                                item.shortname && item.quoteType !== "OPTION" && item.quoteType !== "ETF" && item.quoteType !== "MUTUALFUND" && item.quoteType !== "CRYPTOCURRENCY" && item.quoteType !== "FUTURE" ? (
                                    <a
                                        key={index}
                                        href={`/stocks/${item.symbol}/5m`} // Use anchor tag for full page reload
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default anchor behavior
                                            handleLinkClick(item.symbol); // Handle click with custom logic
                                        }}
                                    >
                                        {item.shortname} ({item.symbol})
                                    </a>
                                ) : null
                            )
                        ) : (
                            <div></div> // Handle no results
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Search;