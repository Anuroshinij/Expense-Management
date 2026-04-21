import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Global error handling 
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired / invalid
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);


// CATEGORY APIs
export const fetchCategories = () => API.get("/categories");

export const createCategory = (data) =>
  API.post("/categories", data);

// EXPENSE APIs


export const fetchExpenses = (date) =>
  API.get(`/expenses?date=${date}`);

export const addExpense = (data) =>
  API.post("/expenses", data);

export const updateExpense = (id, data) =>
  API.put(`/expenses/${id}`, data);

export const deleteExpense = (id) =>
  API.delete(`/expenses/${id}`);


export default API;