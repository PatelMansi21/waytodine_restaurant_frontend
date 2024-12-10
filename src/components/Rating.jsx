import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/RatingStyle.css";
import { BASE_URL } from "../AppConfig";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const resid = sessionStorage.getItem("restaurantId");


  // Fetch reviews and customer details from APIs
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getallfeedbacks/${resid}`);
        
        const reviewsWithCustomerNames = await Promise.all(
          response.data.$values.map(async (review) => {
            try {
              // Fetch customer name based on userId
              const userResponse = await axios.get(`${BASE_URL}/getuserbyid/${review.userId}`);
              console.log(userResponse);
              return {
                ...review,
                customerName: userResponse.data.firstName || "Unknown",
              };
            } catch (error) {
              console.error(`Error fetching customer for review ID ${review.feedbackId}`, error);
              return { ...review, customerName: "Unknown" };
            }
          })
        );

        setReviews(reviewsWithCustomerNames); // Update reviews state with customer names
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const totalStars = 5;

    return (
      <div className="star-container">
        {Array.from({ length: totalStars }, (_, index) => (
          <span
            key={index}
            className={`star ${index < fullStars ? "filled-star" : "empty-star"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="card m-4">
        <div className="card-body">
          <h5>Customer Reviews and Ratings</h5>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by customer name or comment"
            value={searchTerm}
            onChange={handleSearch}
          />

          <table className="table table-bordered table-hover">
            <thead className="table-warning">
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length === 0 ? (
                <tr>
                  <td colSpan="5">No matching records found</td>
                </tr>
              ) : (
                currentReviews.map((review, index) => (
                  <tr key={index}>
                    <td>{review.feedbackId}</td>
                    <td>{review.customerName}</td>
                    
                    <td>
                      {review.rating} / 5
                      <div>{renderStars(review.rating)}</div>
                    </td>
                    <td>{review.review}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <nav>
            <ul className="pagination">
              {[...Array(totalPages).keys()].map((number) => (
                <li
                  key={number}
                  className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
                >
                  <button
                    onClick={() => paginate(number + 1)}
                    className="page-link"
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
