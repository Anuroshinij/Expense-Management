import React, { useState } from "react";
import { createCategory } from "../services/api";

const CategoryModal = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Category name required");
      return;
    }

    try {
      setLoading(true);
      await createCategory({ name: name.trim() });

      setName("");
      onSuccess();   // refresh categories
      onClose();     // close modal
    } catch (err) {
      alert(err.response?.data?.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Create Category</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          style={styles.input}
        />

        <div style={styles.actions}>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
};