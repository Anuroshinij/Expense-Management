# Expense Management Full Stack (React + Spring Boot)

# 💰 Expense Management System

A full-stack **Expense Tracking & Financial Insights App** built using **Spring Boot** and **React**.  
It helps users manage daily expenses, analyze spending, and track monthly savings.

---

## 🚀 Features

- 📅 **Dashboard** – Track daily expenses using a calendar
- 💳 **Expense Management** – Add, edit, delete expenses (amount, category, date, description)
- 📂 **Categories** – Create and reuse custom categories
- 📊 **Reports** – Weekly & monthly summaries + category breakdown
- 📈 **Analytics** – Visual charts for spending trends
- 💰 **Finance Module** – Salary input + savings calculation  
  `Savings = Salary - Expenses`

---

## 🏗️ Tech Stack

**Backend**
- Spring Boot
- Spring Security + JWT
- JPA / Hibernate
- MySQL

**Frontend**
- React.js
- React Query
- Axios (with interceptors)
- React Router

---

## 🔐 Authentication

- User login & registration
- Password encryption (BCrypt)
- JWT-based authentication
- Protected routes (USER / ADMIN)

---

## 🔌 API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login


### Expenses

- GET /api/expenses?date=
- POST /api/expenses
- PUT /api/expenses/{id}
- DELETE /api/expenses/{id}


### Categories

- GET /api/categories
- POST /api/categories


### Reports

- GET /api/reports/weekly
- GET /api/reports/monthly
- GET /api/reports/category


### Salary

- POST /api/salary
- GET /api/salary


---

## 🧠 Architecture

**Backend**

Controller → Service → Repository


**Frontend**

Pages → Components → API Layer


---

## ⚡ Highlights

- JWT authentication with filters
- Axios interceptor for token handling
- React Query for caching & sync
- Java Streams for aggregation
- Clean DTO-based API design

---

## 📦 Setup

### 🔹 Backend
```bash
cd backend
mvn spring-boot:run
```

### 🔹 Frontend
```bash
cd frontend
npm install
npm start
```
