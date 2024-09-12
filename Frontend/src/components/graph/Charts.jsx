import { useEffect, useState, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import './chart.css';
import { useParams } from 'react-router-dom';

function Chart() {
  const [data, setData] = useState(null);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const chart = useRef(null);
  const { stock, interval } = useParams();


  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stock-price/${stock}/${interval}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stock price data');
        }
        const result = await response.json();
        
        const priceResponse = await fetch(`http://localhost:3000/api/current-stock-price/${stock}`);
        if (!priceResponse.ok) {
          throw new Error('Failed to fetch current stock price');
        }
        const priceData = await priceResponse.json();
        const newPrice = priceData.regularMarketPrice;

        const chartData = result.quotes.map((data) => ({
          time: new Date(new Date(data.date).toUTCString()).getTime() / 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close
        })).filter(item => item.open && item.high && item.low && item.close);

        // Update the last data point with the new price
        if (chartData.length > 1) {
          chartData[chartData.length - 1] = {
            time: chartData[chartData.length - 1].time,
            open: chartData[chartData.length - 2].close,
            high: chartData[chartData.length - 1].high,
            low: chartData[chartData.length - 1].low,
            close: newPrice,
          };
        }

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }); // Run fetchData when stock or interval changes

  // Initialize and update chart
  useEffect(() => {
    if (data && chartContainerRef.current) {
      try {
        if (!chart.current) {
          const chartOptions = {
            layout: { textColor: 'white', background: { type: 'solid', color: '#1d232a' } },
            grid: {
              vertLines: {
                color: 'grey'
              },
              horzLines: {
                color: 'grey'
              }
            },
            timeScale: {
              timeVisible: true,
              secondsVisible: true,
            }
          };
          chart.current = createChart(chartContainerRef.current, chartOptions);
          candleSeriesRef.current = chart.current.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
          });
        }
        candleSeriesRef.current.setData(data); // Only set data if it exists
      } catch (error) {
        console.error('Error setting up chart:', error);
      }
    }
  }, [data]);

  // Cleanup on component unmount or when stock/interval changes
  useEffect(() => {
    return () => {
      if (chart.current) {
        chart.current.remove();
        chart.current = null;
        candleSeriesRef.current = null; // Reset candle series reference
      }
    };
  }, [stock, interval]);

  return (
    <div className="graph-container">
      <div ref={chartContainerRef} className="graph" />
    </div>
  );
}

export default Chart;