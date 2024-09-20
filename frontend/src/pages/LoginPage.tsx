import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <h1>Register</h1>
      {/* Implement registration form */}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={handleLoginGoogle}>login google</button>
    </div>
  );
};

export default LoginPage;
