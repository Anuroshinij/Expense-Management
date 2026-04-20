import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import CalendarView from "./CalendarView";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const formatDate = (d) => d.toISOString().split("T")[0];

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data.data);
  };

  // 🔹 Fetch expenses
  const fetchExpenses = useCallback(async () => {
    const res = await API.get(`/expenses?date=${formatDate(date)}`);
    setData(res.data.data);
  }, [date]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // 🔹 SAVE (Add + Update)
  const handleSave = async (form) => {
    if (selectedExpense) {
      await API.put(`/expenses/${selectedExpense.id}`, {
        date: formatDate(date),
        ...form,
      });
    } else {
      await API.post("/expenses", {
        date: formatDate(date),
        ...form,
      });
    }

    setSelectedExpense(null);
    fetchExpenses();
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  // 🔹 EDIT (PREFILL TRIGGER)
  const handleEdit = (item, categoryName) => {
    const category = categories.find((c) => c.name === categoryName);

    setSelectedExpense({
      ...item,
      categoryId: category?.id,
    });
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* 📅 Calendar */}
      <CalendarView date={date} setDate={setDate} />

      <div style={{ marginLeft: "20px", flex: 1 }}>
        <h2>Expenses - {formatDate(date)}</h2>

        {/* ➕ FORM */}
        <ExpenseForm
          selectedExpense={selectedExpense}
          categories={categories}
          selectedDate={date}
          onSave={handleSave}
        />

        {/* 📊 LIST */}
        <ExpenseList data={data} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Dashboard;
