import API from "./api";

// Set salary
export const setSalary = (month, year, amount) =>
  API.post(`/salary?month=${month}&year=${year}&amount=${amount}`);

// Get salary
export const getSalary = (month, year) =>
  API.get(`/salary?month=${month}&year=${year}`);