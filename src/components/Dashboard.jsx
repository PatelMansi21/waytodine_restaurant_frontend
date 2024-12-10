import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import buffet from "../images/buffet.jpg";
import burger from "../images/burger (1).jpg";
import noodles from "../images/noodles.png";
import "../css/DashboardStyle.css";

export default function Dashboard() {
  const progressData = [
    { label: "Week 1 - 25%", width: "25%", color: "bg-primary" },
    { label: "Week 2 - 50%", width: "50%", color: "bg-info" },
    { label: "Week 3 - 75%", width: "75%", color: "bg-success" },
    { label: "Week 4 - 100%", width: "100%", color: "bg-danger" },
  ];
  const percentage = 72;

  const favouriteItems = [
    {
      name: "Fish Burger",
      price: "$12.40",
      description: "2 Part Chicken",
      imageUrl: buffet,
    },
    {
      name: "Beef Burger",
      price: "$24.64",
      description: "Small Size",
      imageUrl: burger,
    },
    {
      name: "Cheese Burger",
      price: "$14.78",
      description: "3 Part Cream",
      imageUrl: noodles,
    },
  ];

  const [likedItems, setLikedItems] = useState({});
  const toggleLike = (itemName) => {
    setLikedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <div>
      <div className="row p-4">
        <div className="col-md-3">
          <div className="card hover-effect">
            <div className="card-body card2">
              <h5>Sells Graph</h5>
              <h2>Rs.8,451</h2>
              <small className="text-success">+3.2%</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card hover-effect">
            <div className="card-body card1">
              <h5>Total Visitors</h5>
              <h2>3,973</h2>
              <small className="text-danger">-4.5%</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card hover-effect">
            <div className="card-body card5">
              <h5>New Users</h5>
              <h2>7,333</h2>
              <small className="text-success">+12.5%</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card hover-effect">
            <div className="card-body card4">
              <h5>Total Orders</h5>
              <h2>48,973</h2>
              <small className="text-success">+9.5%</small>
            </div>
          </div>
        </div>
      </div>
      {/* most favouriteItems */}
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <div
          className="row"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            className="col-md-5 card bg-card"
            style={{ marginBottom: "20px" }}
          >
            <div>
              <h5>Daily Target Income</h5>
              <div style={styles.circularProgressbar}>
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles({
                    pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                    textColor: "#f88",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
              <p style={styles.amount}>Rs 786.58 From Rs 1,000</p>
            </div>
          </div>

          <div className="col-md-6 card bg-card">
            <div>
              <h5>Most Favourite Items</h5>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {favouriteItems.map((item, index) => (
                  <div key={index} style={styles.mostFavItem}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={styles.image}
                    />
                    <button
                      onClick={() => toggleLike(item.name)}
                      style={styles.likeButton}
                    >
                      <i
                        className={`fas fa-heart ${
                          likedItems[item.name] ? "liked" : ""
                        }`}
                      ></i>
                    </button>
                    <h6 style={{ fontSize: "16px", color: "#333" }}>
                      {item.name}
                    </h6>
                    <p style={{ fontSize: "14px", color: "#888" }}>
                      {item.price}
                    </p>
                    <small style={{ fontSize: "12px", color: "#999" }}>
                      [{item.description}]
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Monthly Revenue */}
      <div className="card m-4">
        <div className="card-body">
          <h5>Monthly Revenue</h5>
          <div>
            {progressData.map((progress, index) => (
              <div className="progress mb-2" key={index}>
                <div
                  className={`progress-bar ${progress.color}`}
                  style={{ width: progress.width }}
                >
                  {progress.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  circularProgressbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "150px",
    width: "150px",
    margin: "auto",
  },
  amount: {
    fontSize: "16px",
    textAlign: "center",
    color: "#666",
    marginTop: "10px",
  },
  mostFavItem: {
    position: "relative", // Ensures the button positions relative to this div
    width: "30%",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  likeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#e74c3c",
  },
};
