import React, { useEffect, useState } from "react";

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

  // ✅ Prefill OR Reset
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

  // ✅ Validation
  const validate = () => {
    const err = {};

    if (!form.categoryId) err.categoryId = "Select category";
    if (!form.amount || Number(form.amount) <= 0)
      err.amount = "Enter valid amount";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      description: form.description,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>
            {selectedExpense ? "Edit Expense" : "Add Expense"}
          </h3>
          <span style={styles.close} onClick={onClose}>
            ✕
          </span>
        </div>

        {/* FORM */}
        <div>
          {/* Category */}
          <label style={styles.label}>Category</label>
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
            style={styles.input}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p style={styles.error}>{errors.categoryId}</p>
          )}

          {/* Amount */}
          <label style={styles.label}>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            style={styles.input}
          />
          {errors.amount && <p style={styles.error}>{errors.amount}</p>}

          {/* Description */}
          <label style={styles.label}>Description</label>
          <input
            placeholder="Optional note"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            style={styles.input}
          />
        </div>

        {/* ✅ Buttons directly below inputs */}
        <div style={styles.btnContainer}>
          <button style={styles.saveBtn} onClick={handleSave}>
            {selectedExpense ? "Update" : "Add"}
          </button>

          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  overlay: {
    position: "fixed",
    right: 0,
    top: 0,
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000,
  },

  sidebar: {
    width: "320px",
    height: "100%",
    background: "#fff",
    padding: "20px",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px", // 👈 clean spacing
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  close: {
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },

  label: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "4px",
  },

  input: {
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    width: "100%",
  },

  // ✅ FIXED HERE (no auto push)
  btnContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },

  saveBtn: {
    flex: 1,
    padding: "10px",
    background: "#ff5a5f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#eee",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "-6px",
    marginBottom: "6px",
  },
};

export default ExpenseSidebar;