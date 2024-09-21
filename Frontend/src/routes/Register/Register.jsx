import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (localStorage.getItem('showToast') === 'true') {
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
      localStorage.removeItem('showToast');
    }
  }, []);

  const validateInputs = () => {
    if (!username || username.length < 3) {
      toast.error("Username must be at least 3 characters long.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return false;
    }

    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);

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

      setIsLoading(false);

      if (response.status === 409) {
        localStorage.setItem('showToast', 'true');
        return;
      }

      if (!response.ok) {
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
        return;
      }

      const data = await response.json();
      document.cookie = `token=${data}; path=/`;

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

    } catch (error) {
      setIsLoading(false);
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
                <label className="input input-bordered flex items-center gap-2">
                  <input type="text" className="grow" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input type="email" placeholder="Email" className="grow" onChange={(e) => setEmail(e.target.value)} required />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input type="password" placeholder="Password" className="grow" onChange={(e) => setPassword(e.target.value)} required />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input type="password" placeholder="Confirm Password" className="grow" onChange={(e) => setConfirmPassword(e.target.value)} required />
                </label>
                <label className="label">
                  <Link to="/login" className="label-text-alt link link-hover">Already have an account?</Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className={`btn btn-active ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
