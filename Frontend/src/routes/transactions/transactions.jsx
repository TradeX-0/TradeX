import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { getUser } from "../../services/auth";
import { useCookies } from "react-cookie";
import { gettransaction } from "../../services/stocks";
import getSymbolFromCurrency from 'currency-symbol-map';
import { toast } from "react-toastify";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { PDFDocument, rgb } from 'pdf-lib';

function Transactions() {
    const [user, setUser] = useState(null)
    const [Transaction, setTransactions] = useState([])
    const [cookies] = useCookies(['token']);
    const inrSymbol = getSymbolFromCurrency("INR");
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };


    
const generatePDF = async () => {
    const input = document.getElementById('transaction-table');
    const canvas = await html2canvas(input, {
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfDoc = await PDFDocument.create();
    const imgBytes = await pdfDoc.embedPng(imgData);
    const imgDims = imgBytes.scale(1);

    const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
    page.drawImage(imgBytes, {
        x: 0,
        y: 0,
        width: imgDims.width,
        height: imgDims.height,
    });

    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

    // Create FormData to send Blob as a file
    const formData = new FormData();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    formData.append('file', pdfBlob, 'transaction-history.pdf');
    formData.append('email', user.email);

    // Send the Blob to backend using fetch
    fetch('http://localhost:3000/api/send-history', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('PDF sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending PDF:', error);
    });
};

    useEffect(() => {
        if (cookies.token) {
          const fetchUser = async () => {
            try {
              const userData = await getUser(cookies.token);
              setUser(userData);
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          };
    
          fetchUser();
        }
      }, [cookies.token]);


      useEffect(() => {
        if (user?.id) { // Ensure user is defined and has an ID
          const fetchwatch = async () => {
            try {
              const response = await gettransaction(user);
              setTransactions(response.length > 0 ? response : []);
            } catch (error) {
              console.error('Error fetching watch:', error); // Log any errors
            }
          };
    
          fetchwatch();
        }
      }, [user]);



  return (
    <>
        <Navbar />
        <Link 
          to="/dashboard" 
          className="p-2 ml-4 text-lg font-semibold bg-base-300 text-white rounded-lg shadow hover:bg-base-200 transition duration-300 ease-in-out inline-flex items-center"
        >
          {'<'} Back
        </Link>
        <br />
        <div className="flex justify-between">
        <h2 className="text-3xl font-bold ml-8 mt-8 text-white">Transactions history</h2>
        <button className="btn btn-active mt-12 mr-8" onClick={()=>document.getElementById('send_email').showModal()}>Send PDF via Email</button>
        <dialog id="send_email" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Transactions History</h3>
            <br />
            <p>Are you sure you want to send the transaction history PDF to your email?</p>
            <br />
            <div className="flex">
                <input type="checkbox" className="checkbox checkbox-success"  checked={isChecked} onChange={handleCheckboxChange} />
                <span className="label-text ml-4 mt-1">Yes, I consent on sending mail</span>
            </div>
            <div className='flex justify-center'>
                          <button
                            className="btn btn-outline btn-ghost buy-button mt-8"
                            disabled={!isChecked}
                            onClick={()=>{
                                generatePDF()
                                setIsChecked(false)
                                toast.success("Email sent successfull!", {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "dark",
                                  });
                            }}
                          >
                            Send mail
                          </button>
                        </div>
            <p className="py-4 text-neutral-500 mt-8">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button onClick={()=>{
                setIsChecked(false)
            }}>close</button>
        </form>
        </dialog>
        </div>
        <p className="ml-8 text-lg text-neutral-500">{Transaction.length} Stocks</p>
        {Transaction.length > 0 && <p className="ml-8 text-lg text-neutral-500">Updated on {new Date(Transaction[Transaction.length - 1]?.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  })}</p>}
        <br />
        <div className="overflow-x-auto">
        <table id="transaction-table" className="table table-pin-rows table-pin-cols">
          <thead>
            <tr> 
              <th></th>
              <th>Symbol</th>
              <th>Stock Name</th>
              <th>Executed on</th>
              <th>Type</th>
              <th>Open Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Close Price</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {Transaction.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No Transaction History found.</td>
              </tr>
            ) : (
              Transaction.map((transaction, index) => (
                  <tr key={transaction[index] || `${transaction[index]}-${index}`}>
                  <td>{index + 1}</td>
                  <td><Link to={`/stocks/${transaction.symbol}`} className='text-blue-500'>{transaction.symbol}</Link></td>
                  <td><Link to={`/stocks/${transaction.symbol}`} className='text-blue-500'>{transaction.stock_name}</Link></td>
                  <td>{new Date(transaction.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  })}
                  </td>
                  <td className={`pl-column ${
                    transaction.type === "BUY" ? 'text-green-500' : 'text-orange-600'}`}>{(transaction.type) }</td>
                  <td>{inrSymbol}{(transaction.open_price).toFixed(2) }</td>
                  <td>{ (transaction.quantity).toFixed(2)  }</td>
                  <td>{inrSymbol}{ (transaction.total).toFixed(2)  }</td>
                  <td>{inrSymbol}{Transaction.close_price ? inrSymbol : ""}{(transaction.close_price).toFixed(2) }</td>
                  <td className={`pl-column ${
                    transaction.type === "BUY" ?
                    (transaction.PL) >= 0 ? 'text-green-500' : 'text-orange-600'
                  :
                    (transaction.PL) < 0 ? 'text-green-500' : 'text-orange-600'
                  }`}>
                    {transaction.type === "BUY" ? transaction.PL >= 0 ? '+' : '-'
                  :
                  transaction.PL < 0 ? '+' : '-'}{inrSymbol}{Math.abs(transaction.PL).toFixed(2)} ({((transaction.PL/transaction.total)*100).toFixed(2)}%)
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

    </>
  );
}

export default Transactions;
