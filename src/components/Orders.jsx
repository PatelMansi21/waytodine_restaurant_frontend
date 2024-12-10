import React, { useEffect, useState } from "react";
import axios from "axios";
import NewOrder from '../components/NewOrder';
import '../css/OrderStyle.css';
import OrderStatus from '../components/OrderStatus';
import AssignedOrders from '../components/AssignedOrders';
import CompletedOrders from '../components/CompletedOrders';



export default function Orders() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('NewOrder');

  const handleLinkClick = (section) => {
    setSelectedSection(section);
    setMenuOpen(false); // Close the menu after selection
  };

  return (
    <>
      <div>
      
        <div className="order-submenu-container">
          <nav className="navbar">
            <ul className={`menu ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
              <li
                className={`menu-item ${selectedSection === 'NewOrder' ? 'selected' : ''}`}
              >
                <a 
                  href="#NewOrder" 
                  className="link" 
                  onClick={() => handleLinkClick('NewOrder')}
                >
                   ORDERS
                </a>
              </li>
              <li
                className={`menu-item ${selectedSection === 'orderstatus' ? 'selected' : ''}`}
              >
                <a 
                  href="#orderstatus" 
                  className="link" 
                  onClick={() => handleLinkClick('orderstatus')}
                >
                  ORDERS STATUS
                </a>
              </li>
              <li
                className={`menu-item ${selectedSection === 'AssignedOrders' ? 'selected' : ''}`}
              >
                <a 
                  href="#AssignedOrders" 
                  className="link" 
                  onClick={() => handleLinkClick('AssignedOrders')}
                >
                 ASSIGNED DRIVERS
                </a>
              </li>
              <li
                className={`menu-item ${selectedSection === 'CompletedOrders' ? 'selected' : ''}`}
              >
                <a 
                  href="#CompletedOrders" 
                  className="link" 
                  onClick={() => handleLinkClick('CompletedOrders')}
                >
                 Orders Completed
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/* Conditionally render the selected component */}
        {selectedSection === 'orderDetails' && <OrderDetails />}
        {selectedSection === 'NewOrder' && <NewOrder />}
        {selectedSection === 'orderstatus' && <OrderStatus/>}
        {selectedSection === 'AssignedOrders' && <AssignedOrders/>}
        {selectedSection === 'CompletedOrders' && <CompletedOrders/>}
      </div>
    </>
  );
}
