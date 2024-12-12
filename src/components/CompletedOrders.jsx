import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../AppConfig";

export default function AssignedOrder() {
  // State to store assigned orders
  const [assignedOrders, setAssignedOrders] = useState([]);
  
  // Modal state for showing driver details
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
    const resid = sessionStorage.getItem("restaurantId");
const drivername="";
  // Fetch assigned orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/getordercompleted/${resid}`
        );

        console.log("complete=",response.data.$values[0].deliveryPersonId);
        const did=response.data.$values[0].deliveryPersonId;
        const driver = await axios.get(
          `${BASE_URL}/getdeliverypersonbyid/${did}`
        );
        console.log("driver=",driver.data.driverName);
        // drivername= driver.data.driverName;
        const orderWithUser = await Promise.all(
          response.data.$values.map(async (item) => {
            try {
              const categoryResponse = await axios.get(
                `${BASE_URL}/getuserbyid/${item.userId}`
              );
              console.log("user==", categoryResponse);
             
              return {
                ...item,
                username: categoryResponse.data.firstName || "Unknown",
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
        console.log("order with user",orderWithUser);
        setAssignedOrders(orderWithUser);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowDriverModal(true);
  };

  const handleCloseModal = () => {
    setShowDriverModal(false);
    setSelectedOrder(null);
  };

  // Function to update the order status to 'Completed' (status 4)
  const updateOrderStatus = async (orderId) => {
    try {
      // Make API call to update the order status to 4 (Completed)
      await axios.put(`${BASE_URL}/updateorderstatus/${orderId}`, {
        
        orderId:orderId
      });

      // Update the order status locally
      setAssignedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order } : order
        )
      );

      alert("Order status updated to Completed.");
      setShowDriverModal(false); // Close the modal after update
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="card m-4">
      <div className="card-body">
        <h5>Assigned Orders</h5>
        <div className="container mt-4">
          <table className="table table-bordered table-hover">
            <thead className="table-warning">
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>CUSTOMER NAME</th>
                <th>AMOUNT</th>
              {/* <th>STATUS</th> */}
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {assignedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">SORRY.... ! No orders Completed yet !!!!</td>
                </tr>
              ) : (
                assignedOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.orderId}</td>
                    <td>
                      {new Date(order.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td>{order.username}</td>
                    <td>{order.totalAmount}</td>
                  
                    <td>
                      <Button variant="info" onClick={() => handleShowModal(order)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for showing order details */}
      <Modal show={showDriverModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Driver Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <div>
              <p>
                <strong>Order ID:</strong> {selectedOrder.orderId}
              </p>
              <p>
                <strong>Driver Assigned: {drivername}</strong> {selectedOrder.deliveryPersonId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedOrder.orderStatus === 1
                  ? "Order Placed"
                  : selectedOrder.orderStatus === 2
                  ? "Preparing"
                  : selectedOrder.orderStatus === 3
                  ? "On Delivery"
                  : "Delivered"}
              </p>
              {/* Button to mark order as completed */}
              {selectedOrder.orderStatus !== 4 && (
                <Button
                  variant="success"
                  onClick={() => updateOrderStatus(selectedOrder.orderId)}
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          ) : (
            <p>No order details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/RatingStyle.css";

// export default function CompletedOrders() {
//   const completedorder = [
//     {
//         id: "#5552351",
//         date: "26 March 2020, 12:42 AM",
//         name: "Emilia Johanson",
//         location: "67 St. John’s Road, London",
//         amount: "Rs. 251.16",
//         driver: "John Smith",
//       },
//       {
//         id: "#5552397",
//         date: "26 March 2020, 12:42 AM",
//         name: "Rendy Greenlee",
//         location: "32 The Green, London",
//         amount: "Rs. 251.16",
//         driver: "Michael Brown",
//       }, {
//         id: "#5552351",
//         date: "26 March 2020, 12:42 AM",
//         name: "Emilia Johanson",
//         location: "67 St. John’s Road, London",
//         amount: "Rs. 251.16",
//         driver: "John Smith",
//       },
//       {
//         id: "#5552397",
//         date: "26 March 2020, 12:42 AM",
//         name: "Rendy Greenlee",
//         location: "32 The Green, London",
//         amount: "Rs. 251.16",
//         driver: "Michael Brown",
//       }, {
//         id: "#5552351",
//         date: "26 March 2020, 12:42 AM",
//         name: "Emilia Johanson",
//         location: "67 St. John’s Road, London",
//         amount: "Rs. 251.16",
//         driver: "John Smith",
//       },
//       {
//         id: "#5552397",
//         date: "26 March 2020, 12:42 AM",
//         name: "Rendy Greenlee",
//         location: "32 The Green, London",
//         amount: "Rs. 251.16",
//         driver: "Michael Brown",
//       }
//       // Add more assigned orders as needed
//     ];

//   const [orders, setorders] = useState(completedorder);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const filteredReviews = orders.filter(
//     (o) =>
//       o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   return (
//     <div>
//       <div className="card m-4">
//         <div className="card-body">
//           <h5>Completed Orders</h5>
//           <input
//             type="text"
//             className="form-control mb-3"
//             placeholder="Search by customer name or location"
//             value={searchTerm}
//             onChange={handleSearch}
//           />

//           <table className="table table-bordered table-hover">
//             <thead className="table-warning">
//               <tr>
//               <th>ID</th>
//                 <th>DATE</th>
//                 <th>CUSTOMER NAME</th>
//                 <th>LOCATION</th>
//                 <th>AMOUNT</th>
//                 <th>ASSIGNED DRIVER</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentReviews.length === 0 ? (
//                 <tr>
//                   <td colSpan="5">No matching records found</td>
//                 </tr>
//               ) : (
//                 currentReviews.map((or, index) => (
//                   <tr key={index}>
//                     <td>{or.id}</td>
//                     <td>{or.date}</td>
//                     <td>{or.name}</td>
//                    <td>{or.location}</td>
//                     <td>{or.amount}</td>
//                     <td>{or.driver}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           <nav>
//             <ul className="pagination">
//               {[...Array(totalPages).keys()].map((number) => (
//                 <li
//                   key={number}
//                   className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
//                 >
//                   <button
//                     onClick={() => paginate(number + 1)}
//                     className="page-link"
//                   >
//                     {number + 1}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }
