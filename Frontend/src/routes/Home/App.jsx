import { Link } from 'react-router-dom'
import './App.css'

function App() {
  
  return (
    <>
      <h1>Hello</h1>
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
      <button className="btn btn-wide">Wide</button>
      <Link to={"/stocks"}>Stocks</Link>
    </>
  )
}

export default App
