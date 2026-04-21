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
  const [loading, setLoading] = useState(false);

  // 🔹 Category creation state
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const formatDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  // ==========================
  // 🔹 FETCH CATEGORIES
  // ==========================
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Category fetch failed", err);
    }
  };

  // ==========================
  // 🔹 FETCH EXPENSES
  // ==========================
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/expenses?date=${formatDate(date)}`);
      setData(res.data.data);
    } catch (err) {
      console.error("Expense fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ==========================
  // 🔹 CREATE CATEGORY
  // ==========================
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await API.post("/categories", { name: newCategory });
      setNewCategory("");
      setShowCategoryInput(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating category");
    }
  };

  // ==========================
  // 🔹 SAVE (ADD / UPDATE)
  // ==========================
  const handleSave = async (form) => {
    try {
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
    } catch (err) {
      alert(err.response?.data?.message || "Error saving expense");
    }
  };

  // ==========================
  // 🔹 DELETE
  // ==========================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ==========================
  // 🔹 EDIT (PREFILL)
  // ==========================
  const handleEdit = (item, categoryName) => {
    const category = categories.find((c) => c.name === categoryName);

    setSelectedExpense({
      ...item,
      categoryId: category?.id,
    });
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* 📅 LEFT SIDE - CALENDAR */}
      <CalendarView date={date} setDate={setDate} />

      {/* 📊 RIGHT SIDE */}
      <div style={{ marginLeft: "20px", flex: 1 }}>
        <h2>Expenses - {formatDate(date)}</h2>

        {/* ==========================
            ➕ CATEGORY SECTION
        ========================== */}
        <div style={{ marginBottom: "15px" }}>
          <button onClick={() => setShowCategoryInput(!showCategoryInput)}>
            + Create Category
          </button>

          {showCategoryInput && (
            <div style={{ marginTop: "10px" }}>
              <input
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button onClick={handleCreateCategory}>Save</button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>Available Categories</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((c) => (
              <span
                key={c.id}
                style={{
                  padding: "5px 10px",
                  background: "#eee",
                  borderRadius: "10px",
                }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* ==========================
            ➕ EXPENSE FORM
        ========================== */}
        <ExpenseForm
          selectedExpense={selectedExpense}
          categories={categories}
          selectedDate={date}
          onSave={handleSave}
        />

        {/* ==========================
            📊 EXPENSE LIST
        ========================== */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ExpenseList
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
