import React, { useEffect, useState } from "react";

const ExpenseForm = ({
  selectedExpense,
  categories,
  onSave,
  selectedDate,
}) => {
  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    description: "",
  });

  // 🔁 Prefill when editing
  useEffect(() => {
    if (selectedExpense) {
      setForm({
        categoryId: selectedExpense.categoryId || "",
        amount: selectedExpense.amount || "",
        description: selectedExpense.description || "",
      });
    } else {
      setForm({
        categoryId: "",
        amount: "",
        description: "",
      });
    }
  }, [selectedExpense]);

  // 🔧 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "amount"
          ? value === ""
            ? ""
            : Number(value) // ✅ FIX: convert to number
          : name === "categoryId"
          ? value === ""
            ? ""
            : Number(value) // ✅ FIX: convert to number
          : value,
    }));
  };

  // 📅 Format date to yyyy-MM-dd
  const formatDate = (date) => {
    if (!date) return "";

    // if string like 2026-04-20T17:16:44.671Z
    if (typeof date === "string") {
      return date.split("T")[0];
    }

    // if Date object
    return new Date(date).toISOString().split("T")[0];
  };

  // 🚀 Submit handler
  const handleSubmit = () => {
    if (!form.categoryId || !form.amount) {
      alert("Category and Amount are required");
      return;
    }

    const payload = {
      ...form,
      date: formatDate(selectedDate), // ✅ FIXED DATE
    };

    console.log("Sending payload:", payload); // debug

    onSave(payload);

    // 🔄 Reset form after add (optional)
    if (!selectedExpense) {
      setForm({
        categoryId: "",
        amount: "",
        description: "",
      });
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>{selectedExpense ? "Edit Expense" : "Add Expense"}</h3>

      {/* 📂 Category */}
      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 💰 Amount */}
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
      />

      {/* 📝 Description */}
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      {/* ✅ Submit */}
      <button onClick={handleSubmit}>
        {selectedExpense ? "Update" : "Add"}
      </button>
    </div>
  );
};

export default ExpenseForm;