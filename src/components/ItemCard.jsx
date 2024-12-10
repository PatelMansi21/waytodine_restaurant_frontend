import React from "react";

const ItemCard = ({ item }) => {
  const handleEdit = (id) => {
    // Implement your edit logic here
    console.log("Edit item with ID:", id);
  };

  const handleDelete = (id) => {
    // Implement your delete logic here
    console.log("Delete item with ID:", id);
  };

  return (
    <>
      <div className="card m-2 item-card">
        <img
          src={item.image}
          className="card-img-top"
          alt={item.name}
          style={{ maxHeight: "120px", objectFit: "cover" }}
        />
        <div className="card-body">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px",}}>
            <h5 className="card-title" style={{ margin: 0, padding:'0px',fontSize:'17px' }}>
              {item.name}
            </h5>
            <p className="card-text" style={{ margin: 0 }}>
               Rs. {item.price}
            </p>
          </div>
          <div
            className="icon-container"
            style={{
              display: "flex",
              padding:'12px',
              justifyContent: "space-around",
              marginTop: "5px",
            }}
          >
            <i
              className="fas fa-pencil-alt"
              title="Update"
              onClick={() => handleEdit(item.id)}
              style={{
                cursor: "pointer",
                color: "orange",
                fontSize:"20px",
                transition: "color 0.2s, transform 0.2s",
              }}
            ></i>
            <i
              className="fas fa-trash"
              title="Delete"
              onClick={() => handleDelete(item.id)}
              style={{
                cursor: "pointer",
                color: "orange",
                fontSize:"20px",
                transition: "color 0.2s, transform 0.2s",
              }}
            ></i>
            <i
              className="fas fa-ban"
              title="Out of Stock"
              style={{
                cursor: "pointer",
                color: "orange",
                fontSize:"20px",
                transition: "color 0.2s, transform 0.2s",
              }}
            ></i>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default ItemCard;
