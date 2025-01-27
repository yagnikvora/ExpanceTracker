import { useEffect, useState } from "react";
import "./css/Transaction.css"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
const apiUrl = 'http://localhost:5000/api/Transactions';
const Transactions = () => {
  const {isLoggedIn,authorizationToken} = useAuth();
  const navigate = useNavigate();
  const toastId = "login-toast";
  const [transaction, setTransaction] = useState([]);

  const fetchTransactions =async () => {
    await fetch(apiUrl + "/GetAllTransactions", {
      method: "GET",
      headers: {
        Authorization: authorizationToken,
      },
    })
      .then(res => res.json())
      .then(res => setTransaction(res));
  }
  useEffect(() => {
   fetchTransactions();
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!isLoggedIn) {
    if (!toast.isActive(toastId)) {
      toast.error("Please Login First", { toastId });
    }
    return <Navigate to="/" />
  }
  else {

    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Your Transaction Entries</h2>
        <Link className="btn btn-primary mb-3 ms-1" to="/transactions/addedittransaction">Add new transaction</Link>
        <div className="row">
          {transaction.map((t) => (
            <div className="col-md-4 mb-4" key={t.transactionId}>
              <div className="card transaction-card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{t.userName}</h5>
                  <h6 className="card-subtitle mb-3 text-secondary">
                    {t.categoryName} ({t.categoryType})
                  </h6>
                  <p className="card-text">
                    <strong>Payment Method:</strong> {t.methodName} <br />
                    <strong>Amount:</strong> ₹{t.transactionAmount} <br />
                    <strong>Date:</strong> {formatDate(t.transactionDate.split('T')[0])} <br />
                    <strong>Notes:</strong> {t.transactionNotes}
                  </p>
                </div>
                <div className="card-footer text-center bg-light text-muted">
                  Transaction ID: {t.transactionId}
                </div>
                <div className="row py-2">
                  <div className="col d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={() => { navigate("/transactions/addedittransaction/" + t.transactionId) }}>Update</button>
                  </div>
                  <div className="col  d-flex justify-content-center">
                    <button className="btn btn-danger" onClick={async () => {
                      if (confirm("Do you want to delete Transaction " + t.transactionId)) {
                        const response = await fetch(apiUrl + "/DeleteTransactionsByID/" + t.transactionId, {
                          method: "DELETE",
                          headers: {
                            Authorization: authorizationToken,
                        },
                        });

                        const responseData = await response.json();
        
                        if(response.ok){
                            toast.success(responseData.message)
                            fetchTransactions()
                        }
                      }
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }
}
export default Transactions