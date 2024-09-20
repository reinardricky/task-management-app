import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      let token = Cookies.get("token");

      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get("token") || "";
        if (token) {
          // Save token to cookies if found in URL
          Cookies.set("token", token);
        }
      }

      if (token) {
        try {
          // Check if login expired
          const response = await api.get("/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            navigate("/dashboard");
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          setError("Session expired. Please log in again.");
        }
      }
    };
    verifyToken();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      Cookies.set("token", response.data.access_token); // Store JWT
      // Redirect to dashboard (implement with useNavigate)
      if (response.status === 201) {
        alert("User logged in successfully");
        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await api.post("/auth/register", { email, password });
      // Redirect to login page
      if (response.status === 201) {
        alert("User registered successfully");
      }
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  const handleLoginGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className={styles.LoginPage}>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        <div className={styles.inputForm}>
          <div className={styles.label}>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className={styles.inputForm}>
          <div className={styles.label}>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isRegister ? (
          <div className={styles.inputForm}>
            <div className={styles.label}>Confirm Password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        ) : null}
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      {error && <p>{error}</p>}
      <p>or sign in with</p>
      <button className={styles.loginGoogle} onClick={handleLoginGoogle}>
        Sign in with Google
      </button>
      <p>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
        >
          {isRegister ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
