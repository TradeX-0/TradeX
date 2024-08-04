import { useEffect, useState, useRef } from 'react'
import { createChart } from 'lightweight-charts';
import './chart.css'
import { useParams } from 'react-router-dom';

function Chart() {
  const [data, setData] = useState(null);
  const [curr, setcurr] = useState(null);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const chart = useRef(null);
  const { stock } = useParams()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://tradex-g497.onrender.com/api/stock-price/${ stock }`);
        const result = await response.json();
        const price = await fetch(`https://tradex-g497.onrender.com/api/current-stock-price/${ stock }`)
        const res = await price.json()
        const newPrice = res.regularMarketPrice
        const bad_chartData = result.quotes.map((data) => ({
          time: new Date(data.date).getTime() / 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close
        })).filter(item => item.open && item.high && item.low && item.close);;
        const chartData = bad_chartData.slice(0, -1) 
        chartData[chartData.length - 1] = {
            time : chartData[chartData.length - 1].time,
            open : chartData[chartData.length - 1].open,
            high: chartData[chartData.length - 1].high,
            low: chartData[chartData.length - 1].low,
            close: newPrice,
          }
        setcurr(chartData)
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  });

    useEffect(() => {
      if (data != null && chartContainerRef.current) {
        try {
          if (chartContainerRef.current && !chart.current){
          const chartOptions = {
            layout: { textColor: 'white', background: { type: 'solid', color: '#010100' } },
          };
          chart.current = createChart(chartContainerRef.current, chartOptions);
          candleSeriesRef.current = chart.current.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350', 
        });
          candleSeriesRef.current.setData(data);
      }
        } catch (error) {
          throw error
        }
      }
      if (chartContainerRef.current && chart.current){
        candleSeriesRef.current.setData(curr)
      }
      
    }, [data, curr]);
  

  return (
    <>
      <div className="graph-container">
        <div ref={chartContainerRef} className="graph"  />
      </div>
    </>
  )
}

export default Chart