import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/OrderStyle.css";
import { BASE_URL } from "../AppConfig";

export default function NewOrder() {
  const [restaurantOrders, setRestaurantOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]); // To track expanded orders
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const resid = sessionStorage.getItem("restaurantId");

  const acceptOrder = async (orderid) => {
    console.log("Order accepted", orderid);

    try {
      await axios.put(`${BASE_URL}/updatestatus/${orderid}`);
      // Re-fetch orders to refresh the data
      fetchOrders();
    } catch (error) {
      console.error("Error updating order accept status:", error);
    }
  };
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      // Fetch orders
      const response = await axios.get(
        `${BASE_URL}/GetOrdersByRestaurant/${resid}`
      );
      const orders = response.data.$values; // Access the array of orders from the response
      console.log("my orders:", orders);

      // Fetch item names for each order
      const ordersWithItemNames = await Promise.all(
        orders.map(async (restaurant) => {
          const ordersWithItems = await Promise.all(
            restaurant.orders.$values.map(async (order) => {
              const itemsWithNames = await Promise.all(
                order.items.$values.map(async (item) => {
                  // Fetch item name by itemId
                  try {
                    const itemResponse = await axios.get(
                      `${BASE_URL}/MenuItem/${item.itemId}`
                    );
                    // console.log("itemresponse= ",itemResponse);
                    const itemData = itemResponse.data; // Assuming the response contains $values
                    // console.log("itemdata=",itemResponse.data);
                    return { ...item, name: itemData.name }; // Add item name from the response
                  } catch (error) {
                    console.error("Error fetching item name ", error);
                    return { ...item, name: "Unknown" }; // Fallback to "Unknown" if an error occurs
                  }
                })
              );
              return { ...order, items: itemsWithNames };
            })
          );
          return { ...restaurant, orders: ordersWithItems };
        })
      );

      setRestaurantOrders(ordersWithItemNames); // Set the orders with item names
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Toggle expanded orders
  const toggleExpandedOrder = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Filtered orders based on search term
  const filteredOrders = searchTerm
    ? restaurantOrders.flatMap((restaurant) =>
        restaurant.orders.filter(
          (order) =>
            order.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId.toString().includes(searchTerm)
        )
      )
    : restaurantOrders.flatMap((restaurant) => restaurant.orders);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="card m-4">
        <div className="card-body">
          <h5>Orders</h5>
          {/* Search Box */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by Customer Name or Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Orders Table */}
          <table className="table table-bordered table-hover">
            <thead className="table-warning">
              <tr>
                {/* <th>ORDER ID</th> */}
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Actions</th>
                <th>Accept</th> {/* New column for tick mark */}
              </tr>
            </thead>
            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6">No matching records found</td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <React.Fragment key={order.orderId}>
                    <tr>
                      {/* <td>{order.orderId}</td> */}
                      <td>{order.username ?? "N/A"}</td>
                      <td>
                        {new Date(order.createdAt).toISOString().split("T")[0]}
                      </td>
                      <td>{order.totalPrice}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => toggleExpandedOrder(order.orderId)}
                        >
                          {expandedOrders.includes(order.orderId)
                            ? "Hide Items"
                            : "View Items"}
                        </button>
                      </td>
                      {/* New column for accept checkbox */}
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => acceptOrder(order.orderId)}
                          disabled={order.orderStatus !== 1} // Enable only if orderStatus is 1
                        >
                          {order.orderStatus === 1
                            ? "Mark as Prepared"
                            : "Prepared"}
                        </button>
                      </td>
                      {/* <td>{order.orderStatus}</td> */}
                    </tr>
                    {expandedOrders.includes(order.orderId) && (
                      <tr>
                        <td colSpan="6">
                          <ul className="order-items-list">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                Item Name: {item.name} - {item.quantity}
                              </li>
                            ))}
                          </ul>
                          <strong>Total Price: {order.totalPrice}</strong>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
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
  );
}
