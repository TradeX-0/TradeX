import './Stock.css'
import Chart from '../../../components/graph/Charts'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from "../../../components/navbar/Navbar"
import getSymbolFromCurrency from 'currency-symbol-map'

function Stock() {
  const [data, setData] = useState(null)
  const [price, setPrice] = useState(null)

  const { stock } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/quotes/${ stock }`);
        const result = await response.json();

        setData(result);
        setPrice(result.regularMarketPrice)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  });
  const symbol = getSymbolFromCurrency(data?.currency)
  
  return (
    <>
      <Navbar />
      {data == null ? 
        <p className='loading'>Loading..</p> : 
        <div className='data'>
          <p>{data?.shortName} ({data?.symbol})</p>
          <h2>~ {symbol} {Math.round(price * 100)/100}</h2>
        </div>
      }

      <Chart />
      
    </>
  )
}


export default Stock