import React from "react";
import "../styles/PrimaryButton.css";

function PrimaryButton({ text, onClick, loading, type = "button", ariaLabel }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`primary-btn ${loading ? "loading" : ""}`}
      disabled={loading}
      aria-label={ariaLabel}
    >
      {loading ? <span className="spinner" /> : text}
    </button>
  );
}

export default PrimaryButton;