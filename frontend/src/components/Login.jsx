// frontend/src/components/Login.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // Form field values
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // Error message to show if login fails
  const [error, setError]       = useState("");

  // Loading state so button shows "Signing in..." while waiting
  const [loading, setLoading]   = useState(false);

  // signIn comes from AuthContext (talks to Supabase)
  const { signIn } = useAuth();

  // useNavigate lets us redirect the user after login
  const navigate = useNavigate();

  // This runs when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault();   // stops page from refreshing
    setError("");         // clear any old error
    setLoading(true);     // show loading state

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);  // show the error (wrong password, etc.)
      setLoading(false);
    } else {
      navigate("/dashboard"); // success! go to dashboard
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo / Title */}
        <h1 style={styles.title}>⚖️ Legal Triage</h1>
        <p style={styles.subtitle}>Admin Login</p>

        {/* Error box — only shows if there's an error */}
        {error && (
          <div style={styles.errorBox}>
            ❌ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lawfirm.com"
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.8rem",
    textAlign: "center",
    color: "#1a202c",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    textAlign: "center",
    color: "#718096",
    fontSize: "0.95rem",
  },
  errorBox: {
    backgroundColor: "#fff5f5",
    border: "1px solid #fc8181",
    color: "#c53030",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "600",
    color: "#4a5568",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  input: {
    padding: "0.65rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "1.25rem",
    padding: "0.75rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    marginTop: "1.25rem",
    padding: "0.75rem",
    backgroundColor: "#93c5fd",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
  },
};