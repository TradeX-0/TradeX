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
import { CookiesProvider } from 'react-cookie';
import Stocks from './routes/Stocks/Stocks.jsx';
import Email_verify from './routes/Register/Email_Verification/email_verify.jsx';
import { ToastContainer } from 'react-toastify';
import Register from './routes/Register/Register.jsx';
import PrivateRoutes from './utils/PrivateRoutes.jsx';
import Login from './routes/Login/login.jsx';
import AuthRoutes from './utils/AuthRoutes.jsx';
import Verify from "./routes/verify/verify.jsx"
import VerifyRoute from './utils/VerifyRoute.jsx';
import Watchlist from './routes/Watchlist /watchlist.jsx';
import Transactions from './routes/transactions/transactions.jsx';

const router = createBrowserRouter([
  {
    element: <VerifyRoute />,
    children: [
      {
        path: '/verify',
        element: <Verify />
      }
    ]
  },
  {
    path: '/email_verification/:token',
    element: <Email_verify />,
  },
  {
    element: <AuthRoutes />,
    children: [
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/dashboard',
        element: <Stocks />,
      },
      {
        path: '/stocks/:stock',
        element: <Stock />,
      },
      {
        path: '/watchlist',
        element: <Watchlist />,
      },
      {
        path: '/transactions',
        element: <Transactions />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <RouterProvider router={router} />
      <ToastContainer />
    </CookiesProvider>
    
  </>
);
