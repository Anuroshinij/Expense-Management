import React from "react";
import Calendar from "react-calendar";

const CalendarView = ({ date, setDate }) => {
  return (
    <div>
      <h3>Select Date</h3>
      <Calendar value={date} onChange={setDate} />
    </div>
  );
};

export default CalendarView;