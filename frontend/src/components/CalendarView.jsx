import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = ({ date, setDate }) => {
  return (
    <div>
      <h3>Select Date</h3>

      <Calendar
        value={date}
        onChange={setDate}
        showNeighboringMonth={false}  // 🔥 hides prev/next dates
      />
    </div>
  );
};

export default CalendarView;