import React, { useState, useEffect } from 'react';

// extra page
const Register = () => {
  const [formData, setFormData] = useState({
    bannerImage: '',
    currentOfferDiscountRate: '',
    description: '',
    mission: '',
    openingHoursWeekdays: '',
    openingHoursWeekends: '',
    specialities: '',
    restaurantId: '', // This will be automatically set
  });

  useEffect(() => {
    // Assuming you can access the session value for restaurantId here
    // const restaurantIdFromSession = sessionStorage.getItem('restaurantId'); // Or use localStorage or any other method
    setFormData((prevData) => ({
      ...prevData,
      restaurantId: 1,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === 'file') {
      const file = e.target.files[0]; // Get the selected file
      setFormData((prevData) => ({
        ...prevData,
        [name]: file // Store file object in formData
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send data to API)
    console.log('Restaurant registration data:', formData);
    // If you're sending the file, you may need FormData to handle file uploads
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('bannerImage', formData.bannerImage);
    formDataToSubmit.append('currentOfferDiscountRate', formData.currentOfferDiscountRate);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('mission', formData.mission);
    formDataToSubmit.append('openingHoursWeekdays', formData.openingHoursWeekdays);
    formDataToSubmit.append('openingHoursWeekends', formData.openingHoursWeekends);
    formDataToSubmit.append('specialities', formData.specialities);
    formDataToSubmit.append('restaurantId', formData.restaurantId);
    // Now you can send this FormData to your backend API
    console.log(formDataToSubmit);
  };

  return (
    <div className="container">
      <h2>Restaurant Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bannerImage">Banner Image</label>
          <input
            type="file"
            id="bannerImage"
            name="bannerImage"
            onChange={handleChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="currentOfferDiscountRate">Current Offer Discount Rate</label>
          <input
            type="number"
            id="currentOfferDiscountRate"
            name="currentOfferDiscountRate"
            value={formData.currentOfferDiscountRate}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter discount rate"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Restaurant Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter restaurant description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mission">Restaurant Mission</label>
          <textarea
            id="mission"
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter restaurant mission"
          />
        </div>

        <div className="form-group">
          <label htmlFor="openingHoursWeekdays">Opening Hours (Weekdays)</label>
          <input
            type="text"
            id="openingHoursWeekdays"
            name="openingHoursWeekdays"
            value={formData.openingHoursWeekdays}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter opening hours for weekdays"
          />
        </div>

        <div className="form-group">
          <label htmlFor="openingHoursWeekends">Opening Hours (Weekends)</label>
          <input
            type="text"
            id="openingHoursWeekends"
            name="openingHoursWeekends"
            value={formData.openingHoursWeekends}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter opening hours for weekends"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialities">Specialities</label>
          <input
            type="text"
            id="specialities"
            name="specialities"
            value={formData.specialities}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter restaurant specialities"
          />
        </div>

        <input
          type="hidden"
          id="restaurantId"
          name="restaurantId"
          value={formData.restaurantId}
        />

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
