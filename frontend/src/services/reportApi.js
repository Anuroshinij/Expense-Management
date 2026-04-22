import API from "./api";

// Weekly Report
export const getWeeklyReport = (startDate) =>
  API.get(`/reports/weekly?startDate=${startDate}`);

// Monthly Report
export const getMonthlyReport = (month, year) =>
  API.get(`/reports/monthly?month=${month}&year=${year}`);

// Category Report
export const getCategoryReport = (start, end) =>
  API.get(`/reports/category?start=${start}&end=${end}`);