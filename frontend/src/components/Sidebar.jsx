import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ show, setShow }) => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Reports", icon: "📊", path: "/reports" },
    { name: "Analytics", icon: "📈", path: "/analytics" },
    { name: "Finance", icon: "💰", path: "/finance" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className={`sidebar ${show ? "show" : ""}`}>
      
      <div>
        <h2 className="logo">💰 Expense</h2>

        <div className="menu">
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => setShow(false)} // close on mobile
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              <span className="icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="bottom">
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;