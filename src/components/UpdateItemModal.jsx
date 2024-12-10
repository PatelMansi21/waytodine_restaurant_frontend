import React, { useState, useEffect } from "react"; // Ensure useState is imported
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../AppConfig";

const UpdateItemModal = ({ show, onHide, refreshMenu, currentItem }) => {
  const [formData, setFormData] = useState(currentItem || {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        setCategories(response.data.$values);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentItem) {
      setFormData({
        itemid: currentItem.itemId,
        name: currentItem.name,
        description: currentItem.description,
        isveg: currentItem.isVeg,
        itemImage: currentItem.itemImage,
        price: currentItem.price,
        status: currentItem.status,
        categoryId: currentItem.categoryId,
        RestaurantId: 1,
      });
    }
  }, [currentItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, itemImage: reader.result.split(",")[1] }); // Set file content as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no new image is selected, retain the old image
    const apiPayload = {
      itemid: formData.itemid,
      itemname: formData.name,
      description: formData.description || "",
      isveg: parseInt(formData.isveg, 10),
      itemImage: formData.itemImage || currentItem.itemImage, // Retain old image if none selected
      price: parseFloat(formData.price),
      status: formData.status || 0,
      categoryId: formData.categoryId,
      RestaurantId: 1,
    };

    try {
      await axios.put(`${BASE_URL}/updateitem/`, apiPayload);
      alert("Item updated successfully!");
      refreshMenu(); // Refresh the menu after updating the item
      onHide(); // Close the modal
    } catch (error) {
      console.error("Error updating item", error);
      alert("Error updating item.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Is Veg</Form.Label>
            <Form.Control
              as="select"
              name="isveg"
              value={formData.isveg || 0}
              onChange={handleInputChange}
              required
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Item
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateItemModal;
