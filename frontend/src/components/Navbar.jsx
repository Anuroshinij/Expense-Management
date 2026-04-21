import React from "react";

const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={navStyle}>
      <h2>💰 Expense Tracker</h2>
      <button onClick={logout} style={btnStyle}>Logout</button>
    </div>
  );
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#1e1e2f",
  color: "#fff",
  padding: "15px 20px",
};

const btnStyle = {
  background: "#ff4d4f",
  border: "none",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Navbar;