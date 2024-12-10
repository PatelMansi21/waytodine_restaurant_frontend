import React, { useEffect, useState } from "react";
import CategoryModal from "./CategoryModal";
import axios from "axios";

export default function Category() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(""); // "Veg", "Non-Veg", "All"
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7173/api/Res/categories"
        );
        setCategories(response.data);
        // console.log("data===== ", response.data);
      } catch (error) {
        console.error("Error in fetching categories", error);
      }
    };
    fetchCategory();
  }, []);

  // Add new category
  const addCategory = async (newCategory) => {
    try {
      const response = await axios.post("https://localhost:7173/api/Res/add-category", newCategory);
      setCategories([...category, response.data]); // Add the new category to the state
      console.log("Added category:", response.data);
    } catch (error) {
      console.error("Error in adding category", error);
    }
  };
  

  // Search Functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Filter categories based on search term and status (Veg, Non-Veg, All)
  const filteredcategory = category.filter((c) => {
    const matchesSearch =
      c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "Veg" && c.status === 1) ||
      (filterStatus === "Non-Veg" && c.status === 0);
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentcategory = filteredcategory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredcategory.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="card m-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h2>Manage Category</h2>

              <div
                className="card m-2 item-add-card hover-effect"
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                onClick={() => setShowModal(true)}
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
          <CategoryModal
            show={showModal}
            onHide={() => setShowModal(false)}
            addcategory={addCategory} // Pass the function as a prop
          />

          <div className="container mt-4">
            <div className=" justify-content-between mb-3">
              <div className="flex-column w-60">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by category or type"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className=" d-flex justify-content-between align-items-center">
              <select
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: "20%" }}
              >
                <option value="">All</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>

              <div className="record-count ml-3">
                <span>{filteredcategory.length} Records</span>
              </div>
            </div>

            <table className="table table-bordered table-hover">
              <thead className="table-warning">
                <tr>
                  <th>ID</th>
                  <th>CATEGORY</th>
                  <th>DESCRIPTION</th>
                  <th>IMAGE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {currentcategory.length === 0 ? (
                  <tr>
                    <td colSpan="5">No matching records found</td>
                  </tr>
                ) : (
                  currentcategory.map((c, index) => (
                    <tr key={index}>
                      <td>{c.categoryId}</td>
                      <td>{c.categoryName}</td>
                      <td>{c.description}</td>
                      <td>
                        <img
                          src={c.categoryImage || "/default-image.png"}
                          alt={c.categoryName}
                          width="50"
                          height="50"
                        />
                      </td>
                      <td>{c.status === 1 ? "Veg" : "Non-Veg"}</td>
                    </tr>
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
    </>
  );
}
