import React, { useEffect, useState } from "react";
import {
  getMonthlyReport,
  getCategoryReport,
} from "../services/reportApi";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Reports = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [category, setCategory] = useState([]);
  const [total, setTotal] = useState(0);

  const format = (d) => d.toISOString().split("T")[0];

  const getMonthRange = () => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const today = new Date();
    const safeEnd = end > today ? today : end;
    return { start, end: safeEnd };
  };

  const fillMissingDays = (data) => {
    const map = {};
    data.forEach((d) => (map[d.date] = d.total));

    const result = [];
    const { start, end } = getMonthRange();

    let current = new Date(start);

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];

      result.push({
        date: dateStr,
        total: map[dateStr] || 0,
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  const generateWeeks = (data) => {
    let weeks = [];
    let temp = [];
    let sum = 0;

    data.forEach((d, i) => {
      const day = new Date(d.date).getDay();

      temp.push(d);
      sum += d.total;

      if (day === 0 || i === data.length - 1) {
        weeks.push({
          start: temp[0].date,
          end: temp[temp.length - 1].date,
          total: sum,
        });
        temp = [];
        sum = 0;
      }
    });

    return weeks;
  };

  const loadReports = async () => {
    try {
      const { start, end } = getMonthRange();

      const monthlyRes = await getMonthlyReport(month, year);
      const raw = monthlyRes.data.data;

      const filled = fillMissingDays(raw);
      const totalAmount = filled.reduce((acc, d) => acc + d.total, 0);
      const weeks = generateWeeks(filled);

      let catData = [];
      try {
        const catRes = await getCategoryReport(format(start), format(end));
        catData = catRes.data.data;
      } catch {
        catData = [];
      }

      setDaily(filled);
      setWeekly(weeks);
      setCategory(catData);
      setTotal(totalAmount);
    } catch (err) {
      console.error("Error loading reports", err);
    }
  };

  useEffect(() => {
    loadReports();
  }, [month, year]);

  return (
    <div style={{ display: "flex", background: "#f4f6fb" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "25px" }}>
          {/* HEADER */}
          <div style={header}>
            <h2>📊 Reports Dashboard</h2>

            <div style={filterBox}>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "short" })}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          {/* TOTAL CARD */}
          <div style={totalCard}>
            💰 ₹{total}
            <span style={subText}>Monthly Spend</span>
          </div>

          {/* GRID */}
          <div style={grid}>
            
            {/* WEEKLY */}
            <div style={card}>
              <h3>📊 Weekly</h3>
              {weekly.map((w, i) => (
                <div key={i} style={row}>
                  <span>{w.start} → {w.end}</span>
                  <strong>₹{w.total}</strong>
                </div>
              ))}
            </div>

            {/* CATEGORY */}
            <div style={card}>
              <h3>📂 Categories</h3>
              {category.map((c, i) => (
                <div key={i} style={row}>
                  <span>{c.category}</span>
                  <strong>₹{c.total}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* DAILY GRID */}
          <div style={card}>
            <h3>📈 Daily</h3>

            <div style={dailyGrid}>
              {daily.map((d, i) => (
                <div key={i} style={dayBox}>
                  <span style={{ fontSize: "11px" }}>
                    {d.date.split("-")[2]}
                  </span>
                  <strong>₹{d.total}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ---------- STYLES ---------- */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const filterBox = {
  display: "flex",
  gap: "10px",
};

const totalCard = {
  background: "linear-gradient(135deg, #ff5a5f, #ff9966)",
  color: "#fff",
  padding: "20px",
  borderRadius: "12px",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "20px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const subText = {
  fontSize: "14px",
  opacity: 0.8,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

const dailyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
  gap: "10px",
  marginTop: "10px",
};

const dayBox = {
  background: "#f9fafc",
  padding: "10px",
  borderRadius: "8px",
  textAlign: "center",
};

export default Reports;