import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // 🔥 VALIDATORS
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);

  // 🔥 VALIDATION
  const validate = (data) => {
    const newErrors = {};

    if (!data.email) newErrors.email = "Email required";
    else if (!isValidEmail(data.email))
      newErrors.email = "Invalid email format";

    if (!data.password) newErrors.password = "Password required";

    if (!isLogin) {
      if (!data.name) newErrors.name = "Name required";

      if (!isStrongPassword(data.password))
        newErrors.password =
          "Password must contain A-Z, a-z, number & special char";

      if (data.password !== data.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 SUBMIT HANDLER (AUTOFILL FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Reads actual input values (fix autofill issue)
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!validate(data)) return;

    try {
      setLoading(true);

      if (isLogin) {
        const res = await API.post("/auth/login", data);
        localStorage.setItem("token", res.data.data.token);
        navigate("/dashboard");
      } else {
        await API.post("/auth/register", data);
        alert("Signup successful");
        setIsLogin(true);
      }
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        {errors.api && <p style={styles.error}>{errors.api}</p>}

        {/* SIGNUP ONLY */}
        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Name"
              style={styles.input(errors.name)}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}

            <input
              name="adminSecret"
              placeholder="Admin Secret (optional)"
              style={styles.input()}
            />
          </>
        )}

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          style={styles.input(errors.email)}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          style={styles.input(errors.password)}
        />
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        {/* CONFIRM PASSWORD */}
        {!isLogin && (
          <>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              style={styles.input(errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword}</p>
            )}
          </>
        )}

        <button type="submit" style={styles.primaryBtn} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
        </button>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            style={styles.link}
          >
            {isLogin ? " Signup" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    height: "100vh",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    width: "340px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  input: (error) => ({
    width: "100%",
    padding: "11px",
    margin: "8px 0",
    borderRadius: "8px",
    border: error ? "1px solid #f44336" : "1px solid #ddd",
    outline: "none",
  }),

  primaryBtn: {
    width: "100%",
    padding: "11px",
    background: "#ff5a5f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  link: {
    color: "#ff5a5f",
    cursor: "pointer",
    marginLeft: "5px",
    fontWeight: "bold",
  },

  switchText: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#666",
  },

  error: {
    color: "#f44336",
    fontSize: "12px",
    textAlign: "left",
    marginTop: "-5px",
  },
};

export default Login;