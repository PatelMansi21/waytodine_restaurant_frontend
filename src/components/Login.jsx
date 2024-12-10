// Login.js
import React, { useState } from "react";
import axios from "axios";
import waytodine_logo from "../images/logo.jpg";
import "../css/style.css";
import { useNavigate } from "react-router-dom";
import { Toast } from "react-bootstrap";
import { BASE_URL } from "../AppConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // For navigation after successful login

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
      const restaurant=response.data.username;
      const resid=response.data.restaurantId;

      console.log("Login successful",restaurant," ",resid);

      sessionStorage.setItem("resname", response.data.username);
    sessionStorage.setItem("restaurantId", resid);
     
      navigate("/home/dashboard"); // Change this to the first screen after login
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title text-center">Restaurant Login</h3>

          {/* Display error or success message */}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3 w-100">
              Login
            </button>
          </form>

          {/* Logo */}
          <div className="text-center mt-4">
            <img
              src={waytodine_logo}
              alt="WayToDine Logo"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
