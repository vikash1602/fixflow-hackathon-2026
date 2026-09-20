import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register({ onSwitch }) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-mark large">F</div>
          <span>FixFlow</span>
        </div>

        <div className="auth-intro">
          <p className="eyebrow">SMART ISSUE REPORTING</p>
          <h1>
            Make your campus
            <br />
            <span>work better.</span>
          </h1>
          <p>
            Create an account and report infrastructure,
            maintenance, connectivity and other campus issues.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="mobile-brand">
            <div className="brand-mark">F</div>
            <strong>FixFlow</strong>
          </div>

          <div className="auth-heading">
            <h2>Create account</h2>
            <p>Start reporting campus issues today.</p>
          </div>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <label>Full name</label>
            <input
              value={name}
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email address</label>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Minimum 6 characters"
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button
              className="primary-button full"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={onSwitch}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}