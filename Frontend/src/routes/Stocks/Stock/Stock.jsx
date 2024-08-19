import './Stock.css'
import Chart from '../../../components/graph/Charts'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Search from '../../../components/search/Search';

function Stock() {
  const [data, setData] = useState(null)

  const { stock } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/quotes/${ stock }`);
        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [stock]);
  
  return (
    <>
      <Link to={"/stocks"}>back</Link><br/><br/>
      <Search />
      {data == null ? <p>Loading..</p> :
        <div className='data'>
          <p>{data?.shortName} ({data?.symbol})</p>
        </div>
      }
      <Chart />
    </>
  )
}


export default Stock