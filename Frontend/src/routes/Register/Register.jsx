
function Register() {
 

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white">Register!</h1>
            <p className="py-6">
            Real-Time Market Simulations: Experience the thrill of live trading with our accurate and up-to-date market data.<br />
             No Financial Risk: Practice strategies, test ideas, and hone your skills without any risk to your real money.
            Comprehensive Analytics: Gain insights with detailed reports and performance tracking to refine your trading approach.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input type="name" placeholder="Username" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="email" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="password" className="input input-bordered" required />
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input type="password" placeholder="password" className="input input-bordered" required />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">already have a account?</a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-active">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div> 
    </>
  );
}

export default Register;
