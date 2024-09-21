import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Email_verify.css';

function Email_verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('loading');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://trade-x-ux6n.vercel.app/api/email_verify/${token}`);
        if (!response.ok && response.status(401)) {  
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result)
        if (result.response === 'ok') {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setVerificationStatus('failed');
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (verificationStatus === 'success') {
      toast.success('Email Verified Successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      });
      navigate("/")
    }
    if (verificationStatus === 'failed') {
      toast.error('Email Verification Failed. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [verificationStatus, navigate]);

  return (
    <>
      <h1>Verifying your email</h1>
      <p>Please wait...</p> 
    </>
  );
}

export default Email_verify;
