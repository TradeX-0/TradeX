import { useEffect, useState } from "react"
import "./search.css"
import { Link } from "react-router-dom"

function Search() {
    const [dat, setData] = useState("")
    const [com, setCom] = useState([])
    const [visible, setVisibe] = useState(false)

        const show = async()=>{
            setVisibe(true)
        }

        const hide = () =>{
            setTimeout(()=>{
                setVisibe(false)
            },100)
            
        }

        const clear = async()=>{
            setCom([])
            setData("")
        }
    
        useEffect(() => {
            if(dat.trim() != ""){
                const fetchData = async () => {
                        try {
                            const response = await fetch(`http://localhost:3000/api/autoc/${ dat }`);
                            const result = await response.json();
                            const quotes = result.quotes || []
                            setCom(quotes);
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    }
                fetchData();
            }
            else{
                clear()
            }
              
        }, [dat])    

        console.log(com)

    return(
        <>
            <div onFocus={show}>
                <input type="text" placeholder="Search for stocks" onChange={e => setData(e.target.value)} value={dat} onBlur={hide}/>
                {
                    visible && <div className='results text'>
                    {com.length > 0 ? (
                        com.map((item, index) => (
                            item.shortname && item.quoteType != "OPTION" && item.quoteType != "ETF" ? <Link key={index} to={`/stocks/${item.symbol}`} onClick={clear}>{item.shortname} ({item.symbol})</Link> : null
                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
                }
            </div>
        </>
    )


}

export default Search