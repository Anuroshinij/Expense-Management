import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="home">

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-content">
          <h1>💰 Expense Tracker</h1>
          <p>
            Track, analyze and control your expenses with clarity.
            Built for simplicity and real insights.
          </p>

          <div style={{ maxWidth: "220px", margin: "0 auto" }}>
            <PrimaryButton
              text="Get Started"
              onClick={() => navigate("/auth")}
              ariaLabel="Go to login page"
            />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <h2>Why choose this app?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h4>📊 Smart Analytics</h4>
            <p>Visualize daily, weekly and category spending patterns.</p>
          </div>

          <div className="feature-card">
            <h4>📅 Calendar Tracking</h4>
            <p>Easily log and view expenses by date.</p>
          </div>

          <div className="feature-card">
            <h4>📂 Category Insights</h4>
            <p>Understand where your money goes.</p>
          </div>

          <div className="feature-card">
            <h4>⚡ Fast & Simple</h4>
            <p>No clutter. Just what you need to manage money.</p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats">
        <div className="stat">
          <h3>10K+</h3>
          <p>Expenses Tracked</p>
        </div>

        <div className="stat">
          <h3>1K+</h3>
          <p>Active Users</p>
        </div>

        <div className="stat">
          <h3>99%</h3>
          <p>Accuracy</p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <h2>Start managing your money today</h2>
      
      <div style={{ maxWidth: "220px", margin: "0 auto" }}>
        <PrimaryButton
          text="Login / Signup"
          onClick={() => navigate("/auth")}
          ariaLabel="Go to login page"
        />
      </div>
      </section>

    </div>
  );
}

export default Home;