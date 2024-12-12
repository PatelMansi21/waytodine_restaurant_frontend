import React, { useState } from "react";
import axios from "axios";
import waytodine_logo from "../images/logo.jpg";
import "../css/style.css";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import { BASE_URL } from "../AppConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showToast, setShowToast] = useState(false); // For showing the toast
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      setSuccess(response.data.message);
      const restaurant = response.data.username;
      const resid = response.data.restaurantId;

      console.log("Login successful", restaurant, " ", resid);

      sessionStorage.setItem("resname", response.data.username);
      sessionStorage.setItem("restaurantId", resid);

      setShowToast(true); // Show toast on successful login

      // Navigate after a short delay to allow toast to display
      setTimeout(() => {
        navigate("/home/dashboard");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "10px" }}>
        <div className="card-body">
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src={waytodine_logo}
              alt="WayToDine Logo"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
          <h3 className="card-title text-center mb-4">Restaurant Login</h3>

          {/* Display error message */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="fw-bold">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="password" className="fw-bold">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-4 w-100">
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Toast for Success Message */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} bg="success" autohide delay={2000} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Login Successful</strong>
          </Toast.Header>
          {/* <Toast.Body>Welcome back to WayToDine!</Toast.Body> */}
        </Toast>
      </ToastContainer>
    </div>
  );
}
