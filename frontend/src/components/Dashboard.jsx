import React, { useEffect, useState, useCallback } from "react";
import {
  fetchCategories,
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CalendarView from "../components/CalendarView";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseSidebar from "../components/ExpenseSidebar";
import CategoryChips from "../components/CategoryChips";
import CategoryModal from "../components/CategoryModal";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const formatDate = (d) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data.data);
    } catch {
      console.error("Category fetch failed");
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    try {
      const res = await fetchExpenses(formatDate(date));
      setData(res.data.data);
    } catch {
      console.error("Expense fetch failed");
      setData(null);
    }
  }, [date]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // ✅ SAVE
  const handleSave = async (form) => {
    try {
      const payload = {
        date: formatDate(date),
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
        description: form.description,
      };

      if (selectedExpense) {
        await updateExpense(selectedExpense.id, payload);
      } else {
        await addExpense(payload);
      }

      setOpenSidebar(false);
      setSelectedExpense(null);
      loadExpenses();

      // 🔥 scroll to top
      document.getElementById("expenseTop")?.scrollIntoView({
        behavior: "smooth",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  // ✅ EDIT
  const handleEdit = (item, categoryName) => {
    const cat = categories.find((c) => c.name === categoryName);

    setSelectedExpense({
      ...item,
      categoryId: cat?.id,
    });

    setOpenSidebar(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        {/* 🔥 MAIN SPLIT LAYOUT */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT PANEL */}
          <div style={leftPanel}>
            <div style={cardStyle}>
              <h3>Select Date</h3>
              <CalendarView date={date} setDate={setDate} />
            </div>

            <div style={totalCard}>
              💰 Total: ₹{data?.total || 0}
            </div>

            <button
              style={categoryBtn}
              onClick={() => setOpenCategoryModal(true)}
            >
              + Create Category
            </button>

            <CategoryChips categories={categories} />
          </div>

          {/* RIGHT PANEL */}
          <div style={rightPanel} id="expenseTop">

            {!data?.categories || Object.keys(data.categories).length === 0 ? (
              <div style={emptyState}>No expenses 😴</div>
            ) : (
              Object.entries(data.categories)
                .reverse() // 🔥 latest category first
                .map(([category, items]) => (
                  <ExpenseCard
                    key={category}
                    category={category}
                    items={[...items].reverse()} // 🔥 latest item first
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
            )}
          </div>
        </div>

        {/* 🔥 FLOATING BUTTON */}
        <button style={fabBtn} onClick={() => setOpenSidebar(true)}>
          +
        </button>
      </div>

      <ExpenseSidebar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        onSave={handleSave}
        selectedExpense={selectedExpense}
        categories={categories}
      />

      <CategoryModal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onSuccess={loadCategories}
      />
    </div>
  );
};

export default Dashboard;

/* ---------- STYLES ---------- */

const leftPanel = {
  flex: 6,
  padding: "20px",
  background: "#fff",
  borderRadius: "12px",
};

const rightPanel = {
  flex: 4,
  padding: "20px",
  overflowY: "auto",
  background: "#fff",
  borderRadius: "12px",
};

const fabBtn = {
  position: "fixed",
  bottom: "30px",
  right: "40px",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#ff5a5f",
  color: "#fff",
  fontSize: "28px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const cardStyle = {
  background: "#fff",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const totalCard = {
  padding: "12px",
  background: "#fff",
  borderRadius: "10px",
  marginBottom: "10px",
  fontWeight: "bold",
};

const emptyState = {
  textAlign: "center",
  padding: "20px",
  background: "#fff",
  borderRadius: "10px",
  color: "#888",
};

const categoryBtn = {
  padding: "8px 14px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "10px",
};