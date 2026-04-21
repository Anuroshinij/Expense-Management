import { useNavigate } from "react-router-dom";
import React from "react";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💰 Expense Tracker</h1>
        <p style={styles.subtitle}>
          Manage your expenses smartly and stay in control.
        </p>

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/auth")}
        >
          Login / Signup
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#f5f6fa", // same as dashboard
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
    width: "350px",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },
  primaryBtn: {
    padding: "12px",
    width: "100%",
    background: "#ff5a5f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Home;