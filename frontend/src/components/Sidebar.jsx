import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Reports", icon: "📊", path: "/reports" },
    { name: "Analytics", icon: "📈", path: "/analytics" },
  ];

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    // remove all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // optional (clean everything)
    // localStorage.clear();

    // redirect to login
    navigate("/auth");
  };

  return (
    <div style={styles.sidebar}>
      
      {/* TOP */}
      <div>
        <h2 style={styles.logo}>💰 Expense</h2>

        <div style={styles.menu}>
          {menu.map((item, i) => {
            const active = location.pathname === item.path;

            return (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.item,
                  ...(active && styles.active),
                }}
              >
                <span style={styles.icon}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div style={styles.bottom}>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width: "240px",
    height: "95vh",
    background: "linear-gradient(180deg, #0f172a, #020617)",
    color: "white",
    padding: "20px 15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    marginBottom: "25px",
    fontSize: "20px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#cbd5f5",
  },

  icon: {
    fontSize: "16px",
  },

  active: {
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
  },

  bottom: {
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "20px"
  },

  logout: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "500",
    transition: "0.2s",
  },
};