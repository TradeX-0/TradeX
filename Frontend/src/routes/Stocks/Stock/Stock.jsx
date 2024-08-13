import './Stock.css'
import Chart from '../../../components/graph/Charts'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function Stock() {
  const [data, setData] = useState(null)

  const { stock } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stock-price/${ stock }`);
        const result = await response.json();

        setData(result.meta.shortName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  });
  
  return (
    <>
      <div className='data'>
        <p>{data}</p>
      </div>
      <Chart />
    </>
  )
}


export default Stock