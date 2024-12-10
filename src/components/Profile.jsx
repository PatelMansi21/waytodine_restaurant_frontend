import React, { useState, useEffect } from "react";
import { BASE_URL } from "../AppConfig";

export default function RestaurantProfile() {
  const [profileData, setProfileData] = useState({
    email: "",
    phoneNumber: "",
    location: "",
    city: "",
    country: "",
    restaurantDocument: "",
    bannerImage: "",
    currentOfferDiscountRate: "",
    description: "",
    mission: "",
    openingHoursWeekdays: "",
    openingHoursWeekends: "",
    specialities: "",
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1); // Manage the current page
  const [restaurantDocumentName, setRestaurantDocumentName] = useState(""); // To store the document name
  const [bannerimage, setSelectedBannerImage] = useState(""); // Store selected image

  const currect_res =  sessionStorage.getItem("restaurantId");

  // Fetch restaurant data on component mount
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/getrestaurantbyid/${currect_res}`
        );
        const details = await fetch(
          `${BASE_URL}/getrestaurantdetailsbyid/${currect_res}`
        );

        if (response.ok) {
          const data = await response.json();
          const detail_data = await details.json();
          console.log("res data=", data);
          console.log("res details =", detail_data);

          setProfileData({
            name: data.name,
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            location: data.location || "",
            city: data.city || "",
            country: data.country || "",
            restaurantDocument: data.restaurantDocument,
            bannerImage: detail_data.bannerimage,
            currentOfferDiscountRate:
              detail_data.currentOfferDiscountRate || "",
            description: detail_data.description || "",
            mission: detail_data.mission || "",
            openingHoursWeekdays: detail_data.openingHoursWeekdays || "",
            openingHoursWeekends: detail_data.openingHoursWeekends || "",
            specialities: detail_data.specialities || "",
          });
        } else {
          console.error("Failed to fetch restaurant data");
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, []); // Empty dependency array means it runs only once after the initial render

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
  
      // Store the file name in restaurantDocument
      setProfileData((prevData) => ({
        ...prevData,
        restaurantDocument: file.name, // Store file name only
      }));
  
      // Store the file name for display purposes
      setRestaurantDocumentName(file.name);
      console.log("name=",restaurantDocumentName)
    }
  };
  
  
  const handlebannerFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Update bannerImage with base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          bannerImage: reader.result.split(",")[1], // Set base64 string
        }));
      };
      reader.readAsDataURL(file);
      
      console.log("Selected banner image:", file.name);
    }
  };
  

  const handleUpdateRestaurant = async () => {
    const data = {
      restaurantId: currect_res,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
      location: profileData.location,
      city: profileData.city,
      country: profileData.country,
      // If there's a new restaurant document, use it, otherwise use the old one
      restaurantDocument:
        profileData.restaurantDocument || restaurantDocumentName,
    };

    console.log("updated data=", data);

    try {
      const response = await fetch(
        `${BASE_URL}/Updaterestaurant/${currect_res}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Restaurant updated successfully!");
      } else {
        alert("Failed to update restaurant.");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  const handleUpdateRestaurantDetails = async () => {
    const data = {
      bannerImage: profileData.bannerImage,
      currentOfferDiscountRate: profileData.currentOfferDiscountRate,
      description: profileData.description,
      mission: profileData.mission,
      openingHoursWeekdays: profileData.openingHoursWeekdays,
      openingHoursWeekends: profileData.openingHoursWeekends,
      specialities: profileData.specialities,
      RestaurantId: currect_res,
      bannerImage:
      profileData.bannerImage || bannerimage,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/Updaterestaurantdetails/${currect_res}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Restaurant details updated successfully!");
      } else {
        alert("Failed to update restaurant details.");
      }
    } catch (error) {
      console.error("Error updating restaurant details:", error);
    }
  };

  return (
    <div className="container">
      <div className="card mt-5 position-relative">
        <div className="card-body" style={{ margin: "50px" }}>
          <h3 className="mb-4 text-center">Restaurant Profile Update</h3>

          {currentPage === 1 && (
            <div>
              {/* <img src={detail_data.bannerImage} width={"20px"} height={"20px"}/> */}
              <h5>{profileData.name} Info</h5>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={profileData.email}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={profileData.phoneNumber}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={profileData.location}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={profileData.city}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={profileData.country}
                onChange={handleChange}
                className="form-control mb-2"
              />

              <div className="mb-2">
                <input
                  type="file"
                  name="restaurantDocument"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="form-control mb-2"
                />
                <h6>OLD : {profileData.restaurantDocument}</h6>
                NEW : {restaurantDocumentName && (
    <span className="text-muted">{restaurantDocumentName}</span>
  )}
              </div>

              <button
                className="btn btn-primary"
                onClick={handleUpdateRestaurant}
              >
                Update Restaurant
              </button>
            </div>
          )}

          {currentPage === 2 && (
            <div>
              <h5>Update Restaurant Details</h5>
              <div className="mb-3">
                <label>Select Banner Image:</label>
                {/* <img src={profileData.bannerImage} height={"20px"} width={"20px"}/> */}
                <div className="mb-2">
                  <input
                    type="file"
                    name="bannerimage"
                    onChange={handlebannerFileChange}
                    className="form-control mb-2"
                  />
                </div>
              </div>
              <input
                type="number"
                name="currentOfferDiscountRate"
                placeholder="Discount Rate"
                value={profileData.currentOfferDiscountRate}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={profileData.description}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="mission"
                placeholder="Mission"
                value={profileData.mission}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="openingHoursWeekdays"
                placeholder="Weekday Hours"
                value={profileData.openingHoursWeekdays}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="openingHoursWeekends"
                placeholder="Weekend Hours"
                value={profileData.openingHoursWeekends}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="specialities"
                placeholder="Specialities"
                value={profileData.specialities}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <button
                className="btn btn-success"
                onClick={handleUpdateRestaurantDetails}
              >
                Update Restaurant Details
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={{
              position: "absolute",
              top: "50%",
              left: "3px",
              transform: "translateY(-50%)",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "2rem",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            ←
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
            style={{
              position: "absolute",
              top: "50%",
              right: "6px",
              transform: "translateY(-50%)",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "2rem",
              cursor: "pointer",
              zIndex: 10,
              padding: "10px",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
