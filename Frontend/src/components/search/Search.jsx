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
        window.location.href = `/stocks/${symbol}/5m`; 
    };

    useEffect(() => {
        const controller = new AbortController(); // Create a new AbortController instance
        const signal = controller.signal; // Get the signal from the controller

        const fetchData = async () => {
            if (dat.trim() !== "") {
                try {
                    const response = await fetch(`http://localhost:3000/api/autoc/${dat}`, { signal });
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
        }, 500); // Debounce for 500ms

        return () => {
            clearTimeout(debounceTimeout); // Cleanup timeout on unmount or dat change
            controller.abort(); // Abort the fetch request if it is still ongoing
        };
    }, [dat]); // Only run effect when dat changes

    return (
        <>
            <div onFocus={show}>
                <input
                    type="text"
                    placeholder="Search for stocks"
                    className="input input-bordered w-24 md:w-auto"
                    onChange={(e) => setData(e.target.value)}
                    value={dat}
                    onBlur={hide}
                    aria-label="Search for stocks"
                />
                {visible && (
                    <div className='results text' aria-live="polite">
                        {com.length > 0 ? (
                            com.map((item, index) =>
                                item.shortname && item.quoteType !== "OPTION" && item.quoteType !== "ETF" ? (
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