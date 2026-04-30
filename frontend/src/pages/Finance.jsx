import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import SalaryCard from "../components/SalaryCard";

const Finance = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div style={app}>
      <Sidebar />

      <div style={main}>
        {/* HEADER */}
        <div style={header}>
          <h2 style={{ margin: 0 }}>💰 Finance</h2>
          <span style={dateText}>{date.toDateString()}</span>
        </div>

        {/* MONTH SELECTOR */}
        <div style={card}>
          <h4 style={title}>📅 Select Month</h4>

          <input
            type="month"
            value={formatMonth(date)}
            onChange={(e) => setDate(new Date(e.target.value))}
            style={input}
          />
        </div>

        {/* MAIN GRID */}
        <div style={grid}>
          {/* LEFT: Salary */}
          <SalaryCard date={date} />

          {/* RIGHT: Future Section */}
          <div style={card}>
            <h4 style={title}>🚀 Coming Soon</h4>
            <ul style={{ fontSize: "13px", lineHeight: "1.8" }}>
              <li>📊 Monthly Planning</li>
              <li>🎯 Budget Goals</li>
              <li>📈 Insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;

/* ---------- STYLES ---------- */

const app = {
  display: "flex",
  height: "100vh",
  background: "#f4f6fb",
};

const main = {
  flex: 1,
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const dateText = {
  fontSize: "13px",
  color: "#666",
};

const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const title = {
  margin: 0,
  fontSize: "15px",
};

const input = {
  marginTop: "8px",
  padding: "6px",
};

const formatMonth = (date) => {
  return date.toISOString().slice(0, 7);
};