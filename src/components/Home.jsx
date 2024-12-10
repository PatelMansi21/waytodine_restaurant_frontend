import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from "react-router-dom";
import user_profile_default from "../images/user_profile_default.png";
import waytodine_logo from "../images/logo.jpg";
import "../css/style.css";
import "../css/HomeStyle.css";
// import Dashboard from "../components/Dashboard";
// import Orders from "../components/Orders";
// import Profile from "../components/Profile";
// import OrderStatus from "../components/OrderStatus";
// import MenuCrud from "../components/MenuCrud";
// import Category from "../components/Category";
// import Rating from "../components/Rating";
// import Card from "../components/Card";
// import Register from "./Register";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };
  const [activeLink, setActiveLink] = useState("/dashboard"); // Set the initial active link

  // Function to handle link clicks
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const resid = sessionStorage.getItem("restaurantId");
  const resname = sessionStorage.getItem("resname");
  // console.log(resid," ",resname);

  return (
    
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className={`d-flex flex-column bg-light sidebar-container ${
            isSidebarOpen ? "" : "collapsed"
          }`}
          style={{
            minHeight: "100vh",
            width: isSidebarOpen ? "260px" : "80px", // Reduce width when collapsed
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          <div className="p-3 d-flex align-items-center logo-container">
            <img
              src={waytodine_logo}
              alt="WayToDine Logo"
              style={{
                width: "50px",
                height: "50px",
                marginRight: "8px",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            />
            {/* Hide the logo text when collapsed */}
            {isSidebarOpen && <h3 className="logo-text">WayToDine  </h3>}
          </div>
          <ul className="nav flex-column sidebar">

            <li className="nav-item">
              <Link
                to="/home/dashboard"
                className={`nav-link ${
                  activeLink === "/home/dashboard" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("/home/dashboard")}
              >
                <i className="fas fa-tachometer-alt nav-icon"></i>
                {/* Hide the title when the sidebar is collapsed */}
                {isSidebarOpen && <span className="nav-text">DASHBOARD</span>}
              </Link>
            </li>
           
            <li className="nav-item">
              <Link
                to="/home/menucrud"
                className={`nav-link ${
                  activeLink === "/home/menucrud" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("/home/menucrud")}
              >
                <i className="fas fa-utensils nav-icon"></i>
                {isSidebarOpen && <span className="nav-text">MENU </span>}
              </Link>
            </li>
              <li className="nav-item">
                <Link
                  to="/home/orders"
                  className={`nav-link ${
                    activeLink === "/home/orders" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("/home/orders")}
                >
                  <i className="fas fa-boxes nav-icon"></i>
                  {isSidebarOpen && <span className="nav-text">ORDERS</span>}
                </Link>
              </li>
            <li className="nav-item">
              <Link
                to="/home/rating"
                className={`nav-link ${
                  activeLink === "/home/rating" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("/home/rating")}
              >
                <i className="fas fa-solid fa-comments nav-icon"></i>
                {isSidebarOpen && <span className="nav-text">RATING & REVIEWS</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ width: "100%" }}>
          {/* Header */}
          <div
            className="d-flex justify-content-between bg-white shadow-smr "
            style={{ padding: "13px" }}
          >
            <button
              className="navbar-toggle-btn"
              style={{ marginLeft: "20px" }}
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? (
                <i className="fas fa-times"></i>
              ) : (
                <i className="fas fa-bars"></i>
              )}
            </button>

            <div className="d-flex align-items-center position-relative profile-container">
              <h4 style={{ marginRight: "5px" }}>{resname}</h4>
              <img
                src={user_profile_default}
                alt="profile"
                className="rounded-circle"
                style={{ width: "40px", cursor: "pointer" }}
              />
              <div className="profile-menu dropdown-menu-right">
                <Link to="/home/profile" className="dropdown-item">
                  User Profile
                </Link>
                <Link to="/" className="dropdown-item">
                  Logout
                </Link>
              </div>
            </div>
          
          </div>
          <div style={{ padding: "20px", flexGrow: 1, overflow: "auto" }}>
          <Outlet />
        </div>
         
        </div>
       
      </div>
  
  );
}
