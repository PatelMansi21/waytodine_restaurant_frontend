import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/CardStyle.css"; 

export default function CardManagement() {
  const [showModal, setShowModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationDate: "",
    cardType: "credit", // Default to credit card
    cvv: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation for empty fields
    if (
      !cardDetails.cardholderName ||
      !cardDetails.cardNumber ||
      !cardDetails.expirationDate ||
      !cardDetails.cvv
    ) {
      setErrorMessage("All fields are required!");
    } else {
      setErrorMessage("");
      // Proceed with form submission logic, e.g., API call
      alert("Card added successfully!");
      // Reset form after submission
      setCardDetails({
        cardholderName: "",
        cardNumber: "",
        expirationDate: "",
        cardType: "credit",
        cvv: "",
      });
      setShowModal(false); // Close modal after submission
    }
  };

  return (
    <>
    <div className="card m-4">
    <div className="card-body">
    
    <div className="container mt-2">
        <h2>Add Card Here....</h2>
      {/* Dotted Border Card to Add New Card */}
      <div
  className="payment-method-card p-4 text-center mb-2"
  style={{ cursor: "pointer", border:"2px dashed darkorange" }}
  onClick={() => setShowModal(true)}
>
  <h5 className="card-title">+ Add Your Card </h5>
</div>
      {/* Modal to Add Card Details */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="cardModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cardModalLabel">
                Add Your Debit/Credit Card
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                <div className="form-group mb-3">
                  <label htmlFor="cardholderName">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardholderName"
                    name="cardholderName"
                    value={cardDetails.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Enter card number"
                    maxLength="19"
                  />
                </div>

                <div className="form-row mb-3">
                  <div className="col">
                    <label htmlFor="expirationDate">Expiration Date</label>
                    <input
                      type="month"
                      className="form-control"
                      id="expirationDate"
                      name="expirationDate"
                      value={cardDetails.expirationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Card Type</label>
                  <select
                    className="form-control"
                    name="cardType"
                    value={cardDetails.cardType}
                    onChange={handleInputChange}
                  >
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Add Card
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for modal */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowModal(false)}
        />
      )}
    </div>
    </div>
    </div>
    </>
  );
}
