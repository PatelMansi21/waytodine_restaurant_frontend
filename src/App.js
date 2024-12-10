import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import OrderStatus from "./components/OrderStatus";
import MenuCrud from "./components/MenuCrud";
import Category from "./components/Category";
import Rating from "./components/Rating";
import Card from "./components/Card";
import Register from "./components/Register";
import Login from "./components/Login";
import Home  from "./components/Home";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/home" element={<Home />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="orderstatus" element={<OrderStatus />} />
            <Route path="menucrud" element={<MenuCrud />} />
            <Route path="category" element={<Category />} />
            <Route path="rating" element={<Rating />} />
            <Route path="payment" element={<Register />} />
            <Route path="card" element={<Card />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
