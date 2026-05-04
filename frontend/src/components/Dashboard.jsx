import React, { useState, useMemo, useRef } from "react";
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

import "../styles/Dashboard.css";

/* ---------- DATE FORMAT ---------- */
const formatDate = (d) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const topRef = useRef();
  const queryClient = useQueryClient();

  /* ✅ FIX 1: USE STRING DATE */
  const formattedDate = formatDate(date);

  /* ---------- CATEGORIES ---------- */
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetchCategories()).data.data,
    staleTime: 1000 * 60 * 5,
  });

  /* ---------- EXPENSES ---------- */
  const { data, isFetching } = useQuery({
    queryKey: ["expenses", formattedDate],
    queryFn: async () =>
      (await fetchExpenses(formattedDate)).data.data,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  /* ---------- MUTATIONS ---------- */
  const saveMutation = useMutation({
    mutationFn: ({ payload, id }) =>
      id ? updateExpense(id, payload) : addExpense(payload),
    onSuccess: () => {
      /* ✅ FIX 2: ONLY CURRENT DATE INVALIDATE */
      queryClient.invalidateQueries({
        queryKey: ["expenses", formattedDate],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", formattedDate],
      });
    },
  });

  /* ---------- MEMO ---------- */
  const expenseList = useMemo(() => {
    if (!data?.categories) return [];
    return Object.entries(data.categories)
      .reverse()
      .map(([category, items]) => ({
        category,
        items: [...items].reverse(),
      }));
  }, [data]);

  /* ---------- HANDLERS ---------- */
  const handleSave = async (form) => {
    const payload = {
      date: formattedDate,
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      description: form.description,
    };

    await saveMutation.mutateAsync({
      payload,
      id: selectedExpense?.id,
    });

    setOpenSidebar(false);
    setSelectedExpense(null);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleEdit = (item, categoryName) => {
  // find category id from name
  const cat = categories.find((c) => c.name === categoryName);

  // set selected expense (prefill form)
  setSelectedExpense({
      ...item,
      categoryId: cat?.id,
    });

    // open sidebar
    setOpenSidebar(true);
  };

  return (
    <div className="app">
      
      {/* MOBILE MENU BUTTON */}
      <button className="menu-btn" onClick={() => setShowSidebar(true)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <Sidebar show={showSidebar} setShow={setShowSidebar} />

      {/* OVERLAY */}
      {showSidebar && (
        <div className="overlay" onClick={() => setShowSidebar(false)} />
      )}

      {/* MAIN */}
      <div className="main">
        
        <div className="header">
          <h2>📅 Dashboard</h2>
          <span>{date.toDateString()}</span>
        </div>

        <div className="grid">
          
          {/* LEFT */}
          <div className="left">
            <div className="card">
              <h4>📆 Select Date</h4>
              <CalendarView date={date} setDate={setDate} />
            </div>

            <div className="total-card">
              <span>💰 Daily Spend</span>
              <strong>₹{data?.total || 0}</strong>
            </div>

            <div className="card">
              <div className="row-between">
                <h4>📂 Categories</h4>
                <button onClick={() => setOpenCategoryModal(true)}>
                  + Add
                </button>
              </div>
              <CategoryChips categories={categories} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right" ref={topRef}>
            <div className="card full">
              <h4>💳 Expenses</h4>

              <div className="scroll">
                
                {/* ✅ FIX 3: PARTIAL LOADING */}
                {isFetching ? (
                  <div className="skeleton">Loading...</div>
                ) : expenseList.length === 0 ? (
                  <div className="empty">No expenses 😴</div>
                ) : (
                  expenseList.map((item) => (
                    <ExpenseCard
                      key={item.category}
                      category={item.category}
                      items={item.items}
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
        <button className="fab" onClick={() => {
            setSelectedExpense(null); // 🔥 ensure fresh form
            setOpenSidebar(true);
          }}>
          +
        </button>
      </div>

      <ExpenseSidebar
        open={openSidebar}
        onClose={() => {setOpenSidebar(false); setSelectedExpense(null);}}
        onSave={handleSave}
        selectedExpense={selectedExpense}
        categories={categories}
      />

      <CategoryModal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["categories"] })
        }
      />
    </div>
  );
};

export default Dashboard;