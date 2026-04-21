import React from "react";

const ExpenseCard = ({ category, items, onEdit, onDelete }) => {
  return (
    <div style={card}>
      <h3>{category}</h3>

      {items.map((item) => (
        <div key={item.id} style={row}>
          <span>₹{item.amount} - {item.description}</span>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => onEdit(item, category)}>Edit</button>

            <button
              style={deleteBtn}
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this expense?")) {
                  onDelete(item.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "8px",
};

const deleteBtn = {
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ExpenseCard;