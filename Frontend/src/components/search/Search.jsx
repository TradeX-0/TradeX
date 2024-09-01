import { useEffect, useState } from "react";
import "./search.css";
import { useNavigate } from "react-router-dom";

function Search() {
    const [dat, setData] = useState("");
    const [com, setCom] = useState([]);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation

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
        window.location.href = `/stocks/${symbol}/5m`; // Force a full page reload
    };

    useEffect(() => {
        if (dat.trim() !== "") {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/autoc/${dat}`);
                    const result = await response.json();
                    const quotes = result.quotes || [];
                    setCom(quotes);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        } else {
            clear();
        }
    }, [dat]);

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
                />
                {visible && (
                    <div className='results text'>
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
                        ) : null}
                    </div>
                )}
            </div>
        </>
    );
}

export default Search;
