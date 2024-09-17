import { useEffect, useState, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import './chart.css';
import { useParams } from 'react-router-dom';

function Chart({interval}) {
  const [data, setData] = useState(null);
  const [hoveredCandle, setHoveredCandle] = useState({ high: null, low: null });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const chart = useRef(null);
  const { stock } = useParams();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = chartContainerRef.current.getBoundingClientRect();
      setCursorPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };
  
    const chartContainer = chartContainerRef.current;
    if (chartContainer) {
      chartContainer.addEventListener('mousemove', handleMouseMove);
    }
  
    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

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
      }finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
  
    const intervalId = setInterval(fetchData, 1000);
  
    return () => clearInterval(intervalId);
  }, [stock, interval]);  


  useEffect(() => {
    if (data && chartContainerRef.current) {
      try {
        if (!chart.current) {
          const chartOptions = {
            layout: { textColor: 'white', background: { type: 'solid', color: '#1d232a' } },
            grid: {
              vertLines: {
                color: 'grey',
                visible: false
              },
              horzLines: {
                color: 'grey',
                visible: false
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
          
          // Subscribe to crosshair move
          chart.current.subscribeCrosshairMove((param) => {
            if (!param || !param.seriesData) return;
  
            const candleData = param.seriesData.get(candleSeriesRef.current);
            if (candleData) {
              setHoveredCandle({ high: candleData.high, low: candleData.low });
            } else {
              setHoveredCandle({ high: null, low: null });
            }
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
      {data != null && data.length == 0 ? <>{ chart.current == null?<p></p> : <p>data not available</p>}</> : <>{hoveredCandle.high !== null && hoveredCandle.low !== null && (
        <div
          className="hover-info"
          style={{
            position: 'absolute',
            left: cursorPosition.x + 20, // Offset to the right
            top: cursorPosition.y + 200,   // Offset down
            pointerEvents: 'none',         // Prevent hover info from blocking mouse events
          }}
        >
          <p>High: {Math.round(hoveredCandle.high * 100) / 100}</p>
          <p>Low: {Math.round(hoveredCandle.low * 100) / 100}</p>
        </div>
      )}</>}
    </div>
  );
}

export default Chart;