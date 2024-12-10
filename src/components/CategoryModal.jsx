import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../css/CategoryStyle.css";
import axios from "axios";

const CategoryModal = ({ show, onHide, addcategory }) => {
  const [categoryDetails, setCategoryDetails] = useState({
    categoryName: "",
    description: "",
    categoryImage: "", // The image name
    type: "Veg",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryDetails({ ...categoryDetails, [name]: value });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); // Store the file object for upload
      setCategoryDetails({
        ...categoryDetails,
        categoryImage: file.name, // Save only the file name
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { ...categoryDetails };
    console.log("Submitted category:", categoryData);
    
    addcategory(categoryData); // Call the function passed as a prop

    // Reset state and close the modal
    setCategoryDetails({
      categoryName: "",
      description: "",
      categoryImage: "",
      type: "Veg",
    });
    setImageFile(null); // Reset the file input
    onHide(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Category Name Input */}
          <Form.Group controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="categoryName"
              value={categoryDetails.categoryName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Description Input */}
          <Form.Group controlId="formDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={categoryDetails.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Category Image Input */}
          <Form.Group controlId="formCategoryImage" className="mt-3">
            <Form.Label>Category Image</Form.Label>
            <Form.Control
              type="file"
              name="categoryImage"
              onChange={handleFileChange}
            />
            {/* Show the selected file name */}
            {categoryDetails.categoryImage && (
              <small className="form-text text-muted">
                Selected Image: {categoryDetails.categoryImage}
              </small>
            )}
          </Form.Group>

          {/* Type Selection with Radio Buttons */}
          <Form.Group controlId="formType" className="mt-3">
            <Form.Label>Type</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Veg"
                name="type"
                value="Veg"
                checked={categoryDetails.type === "Veg"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Non-Veg"
                name="type"
                value="Non-Veg"
                checked={categoryDetails.type === "Non-Veg"}
                onChange={handleChange}
                inline
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="category-submit-btn mt-3">
            Add Category
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryModal;
