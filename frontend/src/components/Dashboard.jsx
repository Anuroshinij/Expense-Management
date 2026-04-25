import React, {useState} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import CalendarView from "../components/CalendarView";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseSidebar from "../components/ExpenseSidebar";
import CategoryChips from "../components/CategoryChips";
import CategoryModal from "../components/CategoryModal";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetchCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["expenses", date],
    queryFn: async () => {
      const res = await fetchExpenses(formatDate(date));
      return res.data.data;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ payload, id }) => {
      if (id) return updateExpense(id, payload);
      return addExpense(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
    },
  });

  const formatDate = (d) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const handleSave = async (form) => {
    try {
      const payload = {
        date: formatDate(date),
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
        description: form.description,
      };

      await saveMutation.mutateAsync({ payload, id: selectedExpense?.id });
      
      setOpenSidebar(false);
      setSelectedExpense(null);

      document.getElementById("expenseTop")?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (item, categoryName) => {
    const cat = categories.find((c) => c.name === categoryName);

    setSelectedExpense({
      ...item,
      categoryId: cat?.id,
    });

    setOpenSidebar(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert("Delete failed");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={app}>
      <Sidebar />

      <div style={main}>
        {/* HEADER */}
        <div style={header}>
          <h2 style={{ margin: 0 }}>📅 Dashboard</h2>
          <span style={dateText}>{date.toDateString()}</span>
        </div>

        {/* GRID */}
        <div style={grid}>
          {/* LEFT */}
          <div style={leftCol}>
            <div style={card}>
              <h4 style={title}>📆 Select Date</h4>
              <CalendarView date={date} setDate={setDate} />
            </div>

            <div style={totalCard}>
              <span>💰 Daily Spend</span>
              <strong>₹{data?.total || 0}</strong>
            </div>

            <div style={card}>
              <div style={rowBetween}>
                <h4 style={title}>📂 Categories</h4>
                <button
                  style={categoryBtn}
                  onClick={() => setOpenCategoryModal(true)}
                >
                  + Add
                </button>
              </div>

              <CategoryChips categories={categories} />
            </div>
          </div>

          {/* RIGHT */}
          <div style={rightCol} id="expenseTop">
            <div style={cardFull}>
              <h4 style={title}>💳 Expenses</h4>

              <div style={expenseScroll}>
                {!data?.categories ||
                Object.keys(data.categories).length === 0 ? (
                  <div style={emptyState}>No expenses 😴</div>
                ) : (
                  Object.entries(data.categories)
                    .reverse()
                    .map(([category, items]) => (
                      <ExpenseCard
                        key={category}
                        category={category}
                        items={[...items].reverse()}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAB */}
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
        onSuccess={() => queryClient.invalidateQueries(["categories"])}
      />
    </div>
  );
};

export default Dashboard;

/* ---------- STYLES ---------- */

const app = {
  display: "flex",
  height: "100vh", // 🔥 fixed full height
  overflow: "hidden",
  background: "#f4f6fb",
};

const main = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  gap: "10px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "5px",
};

const dateText = {
  fontSize: "13px",
  color: "#666",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "12px",
  flex: 1,
  overflow: "hidden",
};

const leftCol = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const rightCol = {
  display: "flex",
  flexDirection: "column",
};

const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const cardFull = {
  ...card,
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const expenseScroll = {
  overflowY: "auto",
  marginTop: "8px",
  paddingRight: "5px",
};

const totalCard = {
  background: "linear-gradient(135deg,#ff5a5f,#ff9966)",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "14px",
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
};

const title = {
  margin: 0,
  fontSize: "15px",
};

const categoryBtn = {
  padding: "4px 10px",
  fontSize: "12px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const emptyState = {
  textAlign: "center",
  padding: "15px",
  fontSize: "13px",
  color: "#999",
};

const fabBtn = {
  position: "fixed",
  bottom: "20px",
  right: "25px",
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#ff5a5f,#ff9966)",
  color: "#fff",
  fontSize: "26px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
};