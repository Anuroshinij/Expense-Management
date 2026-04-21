import React, { useState } from "react";

const CategoryManager = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate({ name });
    setName("");
    setShow(false);
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <button onClick={() => setShow(!show)}>
        + Create Category
      </button>

      {show && (
        <div style={{ marginTop: "10px" }}>
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleCreate}>Save</button>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;