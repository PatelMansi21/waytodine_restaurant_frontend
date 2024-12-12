import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../AppConfig";

export default function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const resid = sessionStorage.getItem("restaurantId");

  useEffect(() => {
    
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/GetAllOrderstatusnew/${resid}`
        // https://localhost:7173/api/Res/GetAllOrderstatusnew/3
      );
  
      console.log("Response=", response.data.$values);
      const orders = response.data.$values;
  
      const orderWithUser = await Promise.all(
        orders.map(async (item) => {
          try {
            const userResponse = await axios.get(
              `${BASE_URL}/getuserbyid/${item.userId}`
            );
            console.log("userResponse=", userResponse.data);
            return {
              ...item,
              username: userResponse.data.firstName || "Unknown",
              location: userResponse.data.location,
            };
          } catch (error) {
            console.error(
              `Error fetching category for item ID ${item.customerId}`,
              error
            );
            return { ...item, username: "Unknown", location: "" };
          }
        })
      );
      setOrders(orderWithUser);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleChangeStatus = async (orderId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updatereadyorderstatus/${orderId}`
        
      );
      console.log("orderid = ",orderId);

      if (response.status === 200) {
       
        console.log("Order status updated successfully.");
        fetchOrders();
      } else {
        console.error("Failed to update order status:", response.data);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="card m-4">
        <div className="card-body">
          <h5>Manage Order Status</h5>
          <div className="container mt-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by Order Name or Location"
              value={searchTerm}
              onChange={handleSearch}
            />
            <table className="table table-bordered table-hover">
              <thead className="table-warning">
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.orderId}</td>
                    <td>
                      {new Date(order.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td>{order.username}</td>
                    <td>{order.location}</td>
                    <td>{order.totalAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.orderStatus === 1
                            ? "bg-primary"
                            : order.orderStatus === 2
                            ? "bg-warning"
                            : order.orderStatus === 3
                            ? "bg-info"
                            : "bg-success"
                        }`}
                      >
                        {order.orderStatus === 1
                          ? "Order Placed"
                          : order.orderStatus === 2
                          ? "Preparing"
                          : order.orderStatus === 3
                          ? "OUT FOR Delivery"
                          : order.orderStatus ===4
                          ? "Delivered"
                          : "no order status"}
                      </span>
                    </td>
                    <td>
                      {(order.orderStatus === 1 || order.orderStatus === 2) && (
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleChangeStatus(order.orderId)
                          }
                        >
                          Mark as Ready
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav>
              <ul className="pagination">
                {[...Array(totalPages).keys()].map((number) => (
                  <li
                    key={number}
                    className={`page-item ${
                      currentPage === number + 1 ? "active" : ""
                    }`}
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
    </div>
  );
}
