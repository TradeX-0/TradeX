import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Check if the flag is set
    if (localStorage.getItem('showToast') === 'true') {
      // Show the toast notification
      toast.error('Account already exists.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Clear the flag
      localStorage.removeItem('showToast');
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // Set a flag in localStorage
        localStorage.setItem('showToast', 'true');
        
        // Optionally, show a toast for the error
        toast.error('Registration failed. Please try again later.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        return; // Exit the function if the response is not ok
      }

      const data = await response.json();
      document.cookie = `token=${data}; path=/`; // Set the token in cookies
      toast.success('Registered successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Wait for the toast to show before navigating
      setTimeout(() => {
        document.location.reload()
      }, 2000); // Delay for 1 second
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <a className="btn btn-ghost text-xl">TradeX</a>
      </div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white">Register!</h1>
            <p className="py-6">
              - Real-Time Market Simulations: Experience the thrill of live trading with our accurate and up-to-date market data.<br />
              - No Financial Risk: Practice strategies, test ideas, and hone your skills without any risk to your real money.<br />
              - Comprehensive Analytics: Gain insights with detailed reports and performance tracking to refine your trading approach.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={submit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label className="label">
                  <Link to="/login" className="label-text-alt link link-hover">Already have an account?</Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-active">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;