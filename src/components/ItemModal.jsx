import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../AppConfig";

const ItemModal = ({ show, onHide, refreshMenu }) => {
  const resid = sessionStorage.getItem("restaurantId");
  const [itemDetails, setItemDetails] = useState({
    categoryId: "",
    description: "",
    itemname: "",
    price: 0,
    status: 1,
    itemImage: "",
    isveg: 0,
    RestaurantId: resid,
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        console.log("Raw API Response:", response.data);

        // Extract the categories from $values
        const categoriesData = response.data.$values || [];
        console.log("Processed Categories:", categoriesData);

        setCategories(categoriesData); // Set the processed categories
      } catch (error) {
        console.error("Error fetching categories", error);
        setCategories([]); // Fallback to an empty array in case of an error
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails((prev) => ({ ...prev, [name]: value }));
  };
  

 
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Update bannerImage with base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemDetails((prev) => ({
          ...prev,
          itemImage: reader.result.split(",")[1], // Set base64 string
        }));
      };
      reader.readAsDataURL(file);
      
      console.log("Selected item image:", file.name);
    }
  };

  // Submit form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      itemname: itemDetails.itemname,
      description: itemDetails.description,
      isveg: parseInt(itemDetails.isveg, 10),
      price: parseFloat(itemDetails.price),
      status: parseInt(itemDetails.status, 10),
      categoryId: parseInt(itemDetails.categoryId, 10),
      itemImage: itemDetails.itemImage, // File name only
      RestaurantId: resid,
    };

    console.log("Payload:", payload);

    try {
      await axios.post(`${BASE_URL}/add-menu-item`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (refreshMenu) refreshMenu(); // Refresh menu after successful submission

      // Reset form and close modal
      setItemDetails({
        categoryId: "",
        description: "",
        itemname: "",
        price: 0,
        status: 1,
        itemImage: "",
        isveg: 0,
        RestaurantId: 1,
      });
      onHide();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.error("Validation errors:", error.response.data.errors);
      } else {
        console.error("Error adding item:", error);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formItemName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="itemname"
              value={itemDetails.itemname || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCategoryId">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="categoryId"
              value={itemDetails.categoryId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={itemDetails.price || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={itemDetails.description || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formIsVeg">
            <Form.Label>Is Veg</Form.Label>
            <Form.Control
              as="select"
              name="isveg"
              value={itemDetails.isveg}
              onChange={handleChange}
              required
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formItemImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {itemDetails.itemImage && (
              <div className="mt-2">Selected File: {itemDetails.itemImage}</div>
            )}
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
