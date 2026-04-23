import React, { useEffect, useState } from "react";
import {
  getMonthlyReport,
  getCategoryReport,
} from "../services/reportApi";

import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [category, setCategory] = useState([]);

  // ✅ FIXED DATE FORMAT (NO TIMEZONE BUG)
  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // ✅ MONTH RANGE
  const getMonthRange = () => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return { start, end: end > today ? today : end };
  };

  // ✅ FILL DAYS (NO 31 BUG)
  const fillMissingDays = (data) => {
    const map = {};
    data.forEach((d) => (map[d.date] = d.total));

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

  // ✅ PERFECT WEEK GROUPING
  const generateWeeks = (data) => {
    let weeks = [];
    let startIndex = 0;

    while (startIndex < data.length) {
      let endIndex = startIndex;

      // go till Sunday OR last day
      while (
        endIndex < data.length - 1 &&
        new Date(data[endIndex].date).getDay() !== 0
      ) {
        endIndex++;
      }

      let sum = 0;
      for (let i = startIndex; i <= endIndex; i++) {
        sum += data[i].total;
      }

      const startDay = data[startIndex].date.slice(8);
      const endDay = data[endIndex].date.slice(8);

        weeks.push({
        name: `${startDay}-${endDay}`, // 🔥 clean label
        total: sum,
        });

      startIndex = endIndex + 1;
    }

    return weeks;
  };

  const loadData = async () => {
    try {
      const { start, end } = getMonthRange();

      const monthlyRes = await getMonthlyReport(month, year);
      const raw = monthlyRes.data.data;

      const filled = fillMissingDays(raw);
      const weeks = generateWeeks(filled);

      const catRes = await getCategoryReport(format(start), format(end));

      setDaily(filled);
      setWeekly(weeks);
      setCategory(catRes.data.data);
    } catch (err) {
      console.error("Analytics error", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  return (
    <div style={layout}>
      <Sidebar />

      <div style={content}>
        {/* HEADER */}
        <div style={header}>
          <h2>📊 Analytics</h2>

          <div>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "short",
                  })}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "80px" }}
            />
          </div>
        </div>

        {/* TOP GRID */}
        <div style={grid}>
          {/* WEEKLY */}
          <div style={card}>
            <h3>📊 Weekly Spend</h3>

            <div style={chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0}/>
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CATEGORY */}
          <div style={card}>
            <h3>📂 Category Spend</h3>

            <div style={chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={category}>
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#22c55e"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* DAILY TREND */}
        <div style={bottomCard}>
          <h3>📈 Daily Trend</h3>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(8)}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ff5a5f"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

/* ---------- STYLES ---------- */

const layout = {
  display: "flex",
  height: "100vh",
};

const content = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  gap: "15px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
};

const card = {
  background: "#fff",
  borderRadius: "12px",
  padding: "15px",
  height: "300px",
};

const bottomCard = {
  background: "#fff",
  borderRadius: "12px",
  padding: "15px",
  height: "200px",
};

const chartBox = {
  width: "100%",
  height: "220px",
};