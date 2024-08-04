import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/Home/App.jsx'
import Stock from './routes/Stocks/Stock/Stock.jsx';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Stocks from './routes/Stocks/Stocks.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/stocks",
    element: <Stocks />,
  },
  {
    path: "/stocks/:stock",
    element: <Stock />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
