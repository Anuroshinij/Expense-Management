import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

const CalendarView = ({ date, setDate, data }) => {
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // ✅ Check visible month
  const isCurrentMonth = (d) =>
    d.getMonth() === activeStartDate.getMonth() &&
    d.getFullYear() === activeStartDate.getFullYear();

  // ✅ Check if this date has expenses
  const hasExpense = (d) => {
    const formatted = d.toISOString().split("T")[0];
    return data?.date === formatted && data?.total > 0;
  };

  return (
    <div className="calendar-card">
      <Calendar
        value={date}
        onChange={setDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }

        // Blur other months
        tileClassName={({ date: d }) =>
          isCurrentMonth(d) ? "tile" : "tile blur"
        }

        // Add custom content (dot indicator)
        tileContent={({ date: d }) =>
          hasExpense(d) ? <div className="dot" /> : null
        }
      />
    </div>
  );
};

export default CalendarView;