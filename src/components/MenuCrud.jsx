import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/MenuStyle.css";
import ItemModal from "../components/ItemModal";
import UpdateItemModal from "../components/UpdateItemModal"; // Import the update modal
import axios from "axios";
import { BASE_URL } from "../AppConfig";

export default function MenuCrud() {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Store the current item being updated
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const resid = sessionStorage.getItem("restaurantId");


  // Function to refresh menu items
  const refreshMenu = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/menuitems/${resid}`
       
      );
      console.log("data in menuitem===========", response.data.$values);
      response.data=response.data.$values;
      const menuWithCategories = await Promise.all(
        response.data.map(async (item) => {
          try {
            const categoryResponse = await axios.get(
              `${BASE_URL}/categories/${item.categoryId}`
            );
            return {
              ...item,
              categoryName: categoryResponse.data.categoryName || "Unknown",
            };
          } catch (error) {
            console.error(
              `Error fetching category for item ID ${item.itemId}`,
              error
            );
            return { ...item, categoryName: "Unknown" };
          }
        })
      );
      setItems(menuWithCategories);
    } catch (error) {
      console.error("Error refreshing menu items", error);
    }
  };

  useEffect(() => {
    refreshMenu();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredOrders = items.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle the edit button click
  const handleEditClick = (item) => {
    console.log("selected item to update =",item);
    setCurrentItem(item); // Set the current item
    setShowUpdateModal(true); // Show the update modal
  };

  // Handle the delete button click
  const handleDeleteClick = async (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/deleteitem/${itemId}`
        );
        if (response.status === 200) {
          alert("Item deleted successfully!");
          refreshMenu(); // Refresh the menu after deleting the item
        } else {
          alert("Failed to delete item.");
        }
      } catch (error) {
        console.error("Error deleting item", error);
        alert("Error deleting item.");
      }
    }
  };

  return (
    <div>
      <div className="card m-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h2>Manage Menu</h2>
              <div
                className="card m-2 item-add-card hover-effect"
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                onClick={() => setShowAddModal(true)} // Open the Add Item modal
              >
                <div
                  className="card-body text-center"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                  }}
                >
                  <h5 className="card-title" style={{ fontSize: "30px" }}>
                    +
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by item name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="row">
            <div className="col-md-15">
              <table className="table table-bordered">
                <thead className="thead-dark table-warning">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Description</th>
                    <th scope="col">Image</th>
                    <th scope="col">Price</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6">No matching records found</td>
                    </tr>
                  ) : (
                    currentOrders.map((c, index) => (
                      <tr key={index}>
                        <td>{c.itemId}</td>
                        <td>{c.name}</td>
                        <td>{c.categoryName}</td>
                        <td>{c.description}</td>
                        <td>
                          <img
                            src={c.itemImage}
                            className="menu-item-img"
                            alt="images"
                          />
                          
                        </td>
                       
                        <td>{c.price} /-</td>
                        <td>
                          <i
                            className="fas fa-edit text-warning"
                            style={{ marginRight: "10px" }}
                            role="button"
                            title="Edit"
                            onClick={() => handleEditClick(c)} // Pass the item to the modal
                          ></i>
                          <i
                            className="fas fa-trash text-danger"
                            style={{ marginLeft: "10px" }}
                            role="button"
                            title="Delete"
                            onClick={() => handleDeleteClick(c.itemId)} // Pass the itemId to delete
                          ></i>
                        </td>
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
            {/* Add Item Modal */}
            <ItemModal
              show={showAddModal}
              onHide={() => setShowAddModal(false)} // Close Add Item modal
              refreshMenu={refreshMenu}
            />
            {/* Update Item Modal */}
            <UpdateItemModal
              show={showUpdateModal}
              onHide={() => setShowUpdateModal(false)}
              refreshMenu={refreshMenu}
              currentItem={currentItem} // Pass the current item
            />
          </div>
        </div>
      </div>
    </div>
  );
}
