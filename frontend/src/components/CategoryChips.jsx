import React from "react";

const CategoryChips = ({ categories }) => {
  return (
    <div style={{ margin: "15px 0" }}>
      <h4 style={{ marginBottom: "8px" }}>Your Categories</h4>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {categories.map((c) => (
          <span
            key={c.id}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              background: "#f1f3f6",
              fontSize: "14px",
            }}
          >
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;