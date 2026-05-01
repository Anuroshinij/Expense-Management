import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { validateAuth } from "../utils/validators";
import toast from "react-hot-toast";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const validationErrors = validateAuth(data, isLogin);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Fix the highlighted fields");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await API.post("/auth/login", data);
        localStorage.setItem("token", res.data.data.token);

        toast.success("Welcome back 🎉");
        navigate("/dashboard");
      } else {
        await API.post("/auth/register", data);

        toast.success("Account created 🚀");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h2>

        {/* NAME */}
        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              className={errors.name ? "input error" : "input"}
              disabled={loading}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <input
              name="adminSecret"
              placeholder="Admin Secret (optional)"
              className="input"
              disabled={loading}
            />
          </>
        )}

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className={errors.email ? "input error" : "input"}
          disabled={loading}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* PASSWORD */}
        <div className="input-group">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={errors.password ? "input error" : "input"}
            disabled={loading}
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="error-text">{errors.password}</p>
        )}

        {/* CONFIRM PASSWORD */}
        {!isLogin && (
          <>
            <div className="input-group">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className={
                  errors.confirmPassword ? "input error" : "input"
                }
                disabled={loading}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="error-text">
                {errors.confirmPassword}
              </p>
            )}
          </>
        )}

        {/* BUTTON */}
        <button className="login-btn" disabled={loading}>
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Signup"}
        </button>

        {/* SWITCH */}
        <p className="switch-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
          >
            {isLogin ? " Signup" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;