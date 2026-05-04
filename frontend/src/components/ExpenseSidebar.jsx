import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import "../styles/ExpenseSidebar.css";

const ExpenseSidebar = ({
  open,
  onClose,
  onSave,
  selectedExpense,
  categories,
}) => {
  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Prefill / Reset
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
    setErrors({});
  }, [selectedExpense, open]);

  if (!open) return null;

  const validate = () => {
    const err = {};
    if (!form.categoryId) err.categoryId = "Select category";
    if (!form.amount || Number(form.amount) <= 0)
      err.amount = "Enter valid amount";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
        description: form.description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exp-overlay" onClick={onClose}>
      <div className="exp-sidebar" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="exp-header">
          <h3>{selectedExpense ? "Edit Expense" : "Add Expense"}</h3>
          <span className="exp-close" onClick={onClose}>✕</span>
        </div>

        {/* FORM */}
        <div>
          <label>Category</label>
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="error">{errors.categoryId}</p>}

          <label>Amount</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />
          {errors.amount && <p className="error">{errors.amount}</p>}

          <label>Description</label>
          <input
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* BUTTONS */}
        <div className="exp-buttons">
          <PrimaryButton
            text={selectedExpense ? "Update" : "Add"}
            onClick={handleSave}
            loading={loading}
            ariaLabel="Save expense"
          />

          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSidebar;