import React, {useState, useMemo } from "react";
import {
  getMonthlyReport,
  getCategoryReport,
} from "../services/reportApi";
import Sidebar from "../components/Sidebar";
import { useQuery } from "@tanstack/react-query";

const Reports = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

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

  const monthlyQuery = useQuery({
    queryKey: ["monthly", month, year],
    queryFn: async () => {
      const res = await getMonthlyReport(month, year);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const categoryQuery = useQuery({
    queryKey: ["category", month, year],
    queryFn: async () => {
      const { start, end } = getMonthRange();
      const res = await getCategoryReport(format(start), format(end));
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const processedData = useMemo(() => {
    if (!monthlyQuery.data) {
      return { daily: [], weekly: [], total: 0 };
    }

    const filled = fillMissingDays(monthlyQuery.data);

    return {
      daily: filled,
      weekly: generateWeeks(filled),
      total: filled.reduce((acc, d) => acc + d.total, 0),
    };
  }, [monthlyQuery.data, month, year]);

  const { daily, weekly, total } = processedData;
  const category = categoryQuery.data || [];

  if (monthlyQuery.isLoading || categoryQuery.isLoading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (monthlyQuery.isError || categoryQuery.isError) {
    return <div style={{ padding: 40 }}>Error loading reports</div>;
  }

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
  marginBottom: "10px", // 🔽 add control
};

const filterBox = {
  display: "flex",
  gap: "10px",
};

const totalCard = {
  background: "linear-gradient(135deg, #ff5a5f, #ff9966)",
  color: "#fff",
  padding: "18px", // 🔽 reduce from 25
  borderRadius: "14px",
  fontSize: "26px", // 🔽 reduce
  fontWeight: "bold",
  margin: "15px 0",
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
  gap: "15px", // 🔽 reduce from 20
};

const card = {
  background: "#fff",
  padding: "14px", // 🔽 reduce from 18
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",   // 🔽 reduce spacing
  borderBottom: "1px solid #eee",
  fontSize: "14px",
  whiteSpace: "nowrap", // 🔥 FIX line break
};

const dailyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", // 🔽 tighter
  gap: "8px",
  marginTop: "10px",
};

const dayBox = {
  background: "#f9fafc",
  padding: "8px", // 🔽 smaller
  borderRadius: "8px",
  textAlign: "center",
};

const dateText = {
  fontSize: "10px", // 🔽 smaller
  color: "#777",
};

const amountText = {
  fontSize: "13px",
  fontWeight: "600",
};

export default Reports;