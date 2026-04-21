import React from "react";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2>💰 Expense</h2>

      <div style={styles.menu}>
        <p>📊 Dashboard</p>
        <p>📅 Calendar</p>
        <p>📂 Categories</p>
        <p>📈 Reports</p>
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