import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverModal from "./DriverModal"; // Import the modal component
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { BASE_URL } from "../AppConfig";

export default function AssignedOrders() {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [alldrivers, setallDrivers] = useState([]); // State to store the fetched drivers
   // State to store the fetched drivers
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const resid = sessionStorage.getItem("restaurantId");

  // Fetch free delivery persons
  // Fetch free delivery persons
const fetchDrivers = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/freedeliverypersons`
    );
    setDrivers(response.data.$values); // Update drivers with fresh data
    console.log("Updated drivers:", response.data);
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
};
const fetchallDrivers = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/alldeliveryperson`
    );
    setallDrivers(response.data.$values); // Update drivers with fresh data
    console.log("all drivers:", response.data.$values);
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
};
// fetchDrivers();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/alloutfordeliveryorders/${resid}`
        );
        console.log("order",response);
        const user=response.data.$values;
        const orderWithUser = await Promise.all(
          user.map(async (item) => {
            try {
              const userResponse = await axios.get(
                `${BASE_URL}/getuserbyid/${item.userId}`
              );
              console.log("user==", userResponse.data);
              return {
                ...item,
                username: userResponse.data.firstName || "Unknown",
              };
            } catch (error) {
              console.error(
                `Error fetching category for item ID ${item.customerId}`,
                error
              );
              return { ...item, username: "Unknown" };
            }
          })
        );
        console.log(orderWithUser);
        setOrders(orderWithUser);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
    fetchDrivers();
    fetchallDrivers();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) =>
    order.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAssignDriverClick = async (index) => {
    setSelectedOrderIndex(index);
    try {
      await fetchDrivers(); // Fetch drivers when the button is clicked
      setShowModal(true); // Open the modal after fetching drivers
    } catch (error) {
      console.error("Error fetching drivers for modal:", error);
    }
  };
  


  const handleSelectDriver = async (driver) => {
    try {
      // Prepare the payload for the API
      const payload = {
        orderId: orders[selectedOrderIndex].orderId, // Assuming `orderId` exists in the order object
        deliveryPersonId: driver.deliveryPersonId, // Assuming `deliveryPersonId` exists in the driver object
      };
      console.log("Payload:", payload);

      // Make the API call to update the order
      const response = await axios.put(
        `${BASE_URL}/assignDriver/${payload.orderId}`,
        payload
      );

      if (response.status === 200) {
        // Update the local orders state
        const updatedOrders = [...orders];
        updatedOrders[selectedOrderIndex].deliveryPersonId =
          driver.deliveryPersonId;
        updatedOrders[selectedOrderIndex].orderStatus = 3;

        setOrders(updatedOrders);
        // fetchDrivers();
      } else {
        console.error("Failed to update the order:", response.data);
      }
    } catch (error) {
      console.error("Error updating the order:", error);
    } finally {
      setShowModal(false); // Close the modal in any case
    }
  };

  return (
    <div>
      <div className="card m-4">
        <div className="card-body">
          <h5>Manage Assigned Orders</h5>
          <div className="container mt-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by Customer Name"
              value={searchTerm}
              onChange={handleSearch}
            />
            <table className="table table-bordered table-hover">
              <thead className="table-warning">
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Driver Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
  {currentOrders.map((order, index) => (
    <tr key={index}>
      <td>{order.orderId}</td>
      <td>{order.username}</td>
      <td>
        {order.deliveryPersonId ? (
          alldrivers.find(
            (driver) => driver.deliveryPersonId === order.deliveryPersonId
          )?.driverName || "Driver Assigned"
        ) : order.orderStatus === 3 ? (
          <button
            className="btn btn-primary"
            onClick={() => handleAssignDriverClick(index)}
          >
            Assign Driver
          </button>
        ) : (
          "N/A"
        )}
      </td>
      <td>
        {order.orderStatus === 3 ? (
          <span className="badge bg-secondary">Out for Delivery</span>
        ) : order.orderStatus === 4 ? (
          <span className="badge bg-success">DELIVERED</span>
        ) : (
          <h6>hii</h6>
        )}
      </td>
    </tr>
  ))}
</tbody>

            </table>
            {/* Pagination */}
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

      {/* Driver selection modal */}
      <DriverModal
        show={showModal}
        onHide={() => setShowModal(false)}
        drivers={drivers} // Pass the fetched drivers to the modal
        onSelectDriver={handleSelectDriver}
      />
    </div>
  );
}
