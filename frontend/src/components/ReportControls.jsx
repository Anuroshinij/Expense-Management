import React from "react";

const ReportControls = ({ month, year, setMonth, setYear }) => {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return (
    <div style={styles.container}>
      <select
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
      >
        {months.map((m, i) => (
          <option key={i} value={i + 1}>
            {m}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
};

export default ReportControls;