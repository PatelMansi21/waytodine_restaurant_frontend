import React from "react";
import { Modal, Button } from "react-bootstrap";

const DriverModal = ({ show, onHide, drivers, onSelectDriver }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select Driver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {drivers.length > 0 ? (
          <ul className="list-group">
            {drivers.map((driver, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => onSelectDriver(driver)}
                style={{ cursor: "pointer" }}
              >
                {driver.driverName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">No drivers are free</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DriverModal;
