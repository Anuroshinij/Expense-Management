import React from "react";

const ExpenseList = ({ data, onEdit, onDelete }) => {
  return (
    <div>
      <h3>Total: ₹{data?.total || 0}</h3>

      {data?.categories &&
        Object.entries(data.categories).map(([category, items]) => (
          <div key={category}>
            <h4>{category}</h4>

            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ccc",
                  padding: "5px",
                }}
              >
                <span>
                  ₹{item.amount} - {item.description}
                </span>

                <div>
                  <button onClick={() => onEdit(item, category)}>
                    Edit
                  </button>
                  <button onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default ExpenseList;