import React from "react";
import PrimaryButton from "../components/PrimaryButton";
import "../styles/ExpenseCard.css";

const ExpenseCard = ({ category, items, onEdit, onDelete }) => {
  return (
    <div className="exp-card">
      <h3>{category}</h3>

      {items.map((item) => (
        <div key={item.id} className="exp-row">
          <span>
            ₹{item.amount} - {item.description}
          </span>

          <div className="actions">
            <PrimaryButton
              text="Edit"
              onClick={() => onEdit(item, category)}
              ariaLabel="Edit expense"
            />

            <button
              className="delete"
              onClick={() => onDelete(item.id)}
              aria-label="Delete expense"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseCard;