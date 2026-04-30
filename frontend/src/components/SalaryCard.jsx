import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSalary, setSalary } from "../services/salaryApi";
import { getMonthlyReport } from "../services/reportApi";

const SalaryCard = ({ date }) => {
  const queryClient = useQueryClient();

  const [salaryInput, setSalaryInput] = useState("");

  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Fetch salary
  const { data: salaryData = 0 } = useQuery({
    queryKey: ["salary", month, year],
    queryFn: async () => {
      const res = await getSalary(month, year);
      return res.data.data;
    },
  });

  // Fetch monthly expenses
  const { data: monthlyData = [] } = useQuery({
    queryKey: ["monthlyReport", month, year],
    queryFn: async () => {
      const res = await getMonthlyReport(month, year);
      return res.data.data;
    },
  });

  const totalExpense = monthlyData.reduce(
    (sum, day) => sum + day.total,
    0
  );

  const savings = salaryData - totalExpense;

  // Save salary
  const saveMutation = useMutation({
    mutationFn: () =>
      setSalary(month, year, Number(salaryInput)),
    onSuccess: () => {
      queryClient.invalidateQueries(["salary"]);
      setSalaryInput("");
    },
  });

  const percent =
    salaryData > 0 ? (totalExpense / salaryData) * 100 : 0;

  return (
    <div style={card}>
      <h4 style={title}>💰 Monthly Finance</h4>

      <div style={{ marginBottom: "8px" }}>
        <input
          type="number"
          placeholder="Set salary"
          value={salaryInput}
          onChange={(e) => setSalaryInput(e.target.value)}
          style={{ padding: "6px", width: "65%", marginRight: "5px" }}
        />
        <button
          style={btn}
          onClick={() => saveMutation.mutate()}
        >
          Save
        </button>
      </div>

      <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
        <div>💰 Salary: ₹{salaryData}</div>
        <div>💸 Expenses: ₹{totalExpense}</div>
        <div
          style={{
            color: savings >= 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          💚 Savings: ₹{savings}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: "8px" }}>
        <div style={progressBg}>
          <div style={{ ...progressFill, width: `${percent}%` }} />
        </div>
        <small>{percent.toFixed(1)}% spent</small>
      </div>
    </div>
  );
};

export default SalaryCard;

/* styles */
const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const title = { margin: 0, fontSize: "15px" };

const btn = {
  padding: "5px 10px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const progressBg = {
  background: "#eee",
  height: "6px",
  borderRadius: "5px",
};

const progressFill = {
  height: "6px",
  background: "#ff5a5f",
  borderRadius: "5px",
};