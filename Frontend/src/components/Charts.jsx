import { useEffect, useState, useRef } from 'react'
import { createChart } from 'lightweight-charts';
import '../App.css'

function Chart() {
  const [data, setData] = useState(null);
  const [curr, setcurr] = useState(null);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const chart = useRef(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/stock-price/AAPL");
        const result = await response.json();
        const chartData = result.quotes.map((data) => ({
          time: new Date(data.date).getTime() / 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close
        })).filter(item => item.open && item.high && item.low && item.close);;
        chartData[chartData.length - 1]
        const newchart = {
          time : chartData[chartData.length - 1].time,
          open : chartData[chartData.length - 2].close,
          high: chartData[chartData.length - 1].high,
          low: chartData[chartData.length - 1].low,
          close: chartData[chartData.length - 1].close
        }
        setcurr(newchart)
        setData(chartData);
        console.log(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
    console.log("hi")
  });

    useEffect(() => {
      if (data != null && chartContainerRef.current) {
        try {
          if (chartContainerRef.current && !chart.current){
          const chartOptions = {
            layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
          };
          chart.current = createChart(chartContainerRef.current, chartOptions);
          candleSeriesRef.current = chart.current.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: true,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });
          candleSeriesRef.current.setData(data);
      }
        } catch (error) {
          throw error
        }
      }
      if (chartContainerRef.current && chart.current){
        console.log(curr)
        candleSeriesRef.current.update(curr)
      }
      return () => {
        if (chart.current) {
          chart.current.remove();
          chart.current = null;
        }
      };
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