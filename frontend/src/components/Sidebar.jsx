import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <h2>💰 Expense</h2>

      <div style={styles.menu}>
        <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
        <p>📅 Calendar</p>
        <p>📂 Categories</p>
        <button onClick={() => navigate("/reports")}>📊 Reports</button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1e1e2f",
    color: "white",
    padding: "20px",
  },
  menu: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    cursor: "pointer",
  },
};

export default Sidebar;
