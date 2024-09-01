import { useEffect, useState, useRef } from 'react'
import { createChart } from 'lightweight-charts';
import './chart.css'
import { useParams } from 'react-router-dom';

function Chart() {
  const [data, setData] = useState(null);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const chart = useRef(null);
  const { stock, interval } = useParams()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stock-price/${ stock }/${interval}`);
        const result = await response.json();
        const price = await fetch(`http://localhost:3000/api/current-stock-price/${ stock }`)
        const res = await price.json()
        const newPrice = res.regularMarketPrice
        const chartData = result.quotes.map((data) => ({
          time: new Date(new Date(data.date).toUTCString()).getTime() / 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close
        })).filter(item => item.open && item.high && item.low && item.close);
        chartData[chartData.length - 1] = {
            time : chartData[chartData.length - 1].time,
            open : chartData[chartData.length - 2].close,
            high: chartData[chartData.length - 1].high,
            low: chartData[chartData.length - 1].low,
            close: newPrice,
          }
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
            layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
            timeScale:{
              timeVisible: true,
              secondsVisible: true,
            }
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
        if (chartContainerRef.current && !chart.current){  
          candleSeriesRef.current.setData(data)
        }  
      }
      
    }, [data]);

    useEffect(()=>{
      return () => {
        if (chart.current) {
          chart.current.remove();
          chart.current = null;
          candleSeriesRef.current = null;
        }
      };
    }, [stock, interval])

  
  return (
    <>
      <div className="graph-container">
        <div ref={chartContainerRef} className="graph"  />
      </div>
    </>
  )
}

export default Chart