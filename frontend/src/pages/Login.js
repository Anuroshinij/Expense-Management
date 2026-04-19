import { useState } from "react";
import API from "../services/api";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminSecret: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        // LOGIN API
        const res = await API.post("/auth/login", loginData);

        localStorage.setItem("token", res.data.data.token);

        alert("Login successful");
        window.location.href = "/dashboard";
      } else {
        // VALIDATION
        if (signupData.password !== signupData.confirmPassword) {
          return alert("Passwords do not match");
        }

        // SIGNUP API
        await API.post("/auth/register", signupData);

        alert("Signup successful");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      {/* SIGNUP FIELDS */}
      {!isLogin && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={signupData.name}
            onChange={handleSignupChange}
            style={styles.input}
          />

          <input
            type="text"
            name="adminSecret"
            placeholder="Admin Secret (optional)"
            value={signupData.adminSecret}
            onChange={handleSignupChange}
            style={styles.input}
          />
        </>
      )}

      {/* COMMON EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={isLogin ? loginData.email : signupData.email}
        onChange={isLogin ? handleLoginChange : handleSignupChange}
        style={styles.input}
      />

      {/* PASSWORD */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={isLogin ? loginData.password : signupData.password}
        onChange={isLogin ? handleLoginChange : handleSignupChange}
        style={styles.input}
      />

      {/* CONFIRM PASSWORD (SIGNUP ONLY) */}
      {!isLogin && (
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={signupData.confirmPassword}
          onChange={handleSignupChange}
          style={styles.input}
        />
      )}

      <button onClick={handleSubmit} style={styles.button}>
        {isLogin ? "Login" : "Signup"}
      </button>

      <p style={{ cursor: "pointer" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "blue", marginLeft: "5px" }}
        >
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    margin: "8px",
    padding: "10px",
    width: "260px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default Login;