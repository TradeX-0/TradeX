import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

function Verify() {
  const [cookies] = useCookies(['token']);
  const [message, setMessage] = useState('Sending verification link. Please wait');

  useEffect(() => {
    const fetchData = async () => {
      if (!cookies.token) {
        setMessage('No verification token found. Please try again.');
        return;
      }

      try {
        const response = await fetch(`https://tradex-101.onrender.com/api/verify-link/${cookies.token}`);
        
        // Check if the response is not okay
        if (!response.ok) {
          if (response.status === 401) {
            setMessage('Invalid or expired token. Please request a new verification link.');
          } else {
            setMessage('An error occurred while verifying your email. Please try again later.');
          }
          return;
        }

        const result = await response.json();
        setMessage(result.message); // Update message on successful verification
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('An error occurred while verifying your email. Please try again later.');
      }
    };

    fetchData();
  }, []); // Dependency on cookies.token

  return (
    <>
      <div className="flex justify-center max-h-screen">
        <div className="card bg-base-200 mt-4 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Verify Account!</h2>
            <p className="justify-center ml-8">{message}</p>
          </div>
        </div>
      </div>

    </>
  ); // Display the message to the user
}

export default Verify;