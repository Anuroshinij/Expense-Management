import React, { useEffect, useState } from "react";
import {
  getMonthlyReport,
  getCategoryReport,
} from "../services/reportApi";
import Sidebar from "../components/Sidebar";

const Reports = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [category, setCategory] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ FIXED DATE FORMAT (NO UTC SHIFT)
  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // ✅ MONTH RANGE (NO FUTURE DATES)
  const getMonthRange = () => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const today = new Date();
    const safeEnd = end > today ? today : end;

    return { start, end: safeEnd };
  };

  // ✅ FILL MISSING DAYS (NO FAKE DATA)
  const fillMissingDays = (data) => {
    const map = {};
    data.forEach((d) => {
      map[d.date] = d.total;
    });

    const result = [];
    const { start, end } = getMonthRange();

    let current = new Date(start);

    while (current <= end) {
      const dateStr = format(current);

      result.push({
        date: dateStr,
        total: map[dateStr] || 0,
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  // ✅ WEEK SPLIT (ONLY CURRENT MONTH, SUN END)
  const generateWeeks = (data) => {
    let weeks = [];
    let temp = [];
    let sum = 0;

    data.forEach((d, i) => {
      const dateObj = new Date(d.date);
      const day = dateObj.getDay(); // Sunday = 0

      temp.push(d);
      sum += d.total;

      // ✅ END WEEK ON SUNDAY OR LAST DAY
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

  // ✅ LOAD DATA
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
        

        <div style={{ padding: "25px" }}>
          {/* HEADER */}
          <div style={header}>
            <h2 style={{ margin: 0 }}>📊 Reports Dashboard</h2>

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

          {/* TOTAL */}
          <div style={totalCard}>
            <div>₹{total}</div>
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
              {category.length === 0 ? (
                <p>No data</p>
              ) : (
                category.map((c, i) => (
                  <div key={i} style={row}>
                    <span>{c.category}</span>
                    <strong>₹{c.total}</strong>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DAILY */}
          <div style={card}>
            <h3>📈 Daily</h3>

            <div style={dailyGrid}>
              {daily.map((d, i) => (
                <div key={i} style={dayBox}>
                  <span style={dateText}>
                    {d.date.split("-")[2]}
                  </span>
                  <strong style={amountText}>₹{d.total}</strong>
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
  padding: "25px",
  borderRadius: "14px",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "20px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 6px 20px rgba(255,90,95,0.3)",
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
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
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
  borderRadius: "10px",
  textAlign: "center",
  transition: "0.2s",
};

const dateText = {
  fontSize: "11px",
  color: "#777",
};

const amountText = {
  fontSize: "14px",
};

export default Reports;