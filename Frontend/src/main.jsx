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

const router = createBrowserRouter([
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
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <RouterProvider router={router} />
      <ToastContainer />
    </CookiesProvider>
    
  </>
);
