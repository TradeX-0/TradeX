import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './routes/Home/App.jsx';
import Stock from './routes/Stocks/Stock/Stock.jsx';
import './index.css';
import {
  createBrowserRouter,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Stocks from './routes/Stocks/Stocks.jsx';
import Email_verify from './routes/Register/Email_Verification/email_verify.jsx';
import { ToastContainer } from 'react-toastify';
import Register from './routes/Register/Register.jsx';
import PrivateRoutes from './utils/PrivateRoutes.jsx';

const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/stocks',
        element: <Stocks />,
      },
      {
        path: '/stocks/:stock/:interval',
        element: <Stock />,
      },
      {
        path: '/email_verification/:token',
        element: <Email_verify />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
