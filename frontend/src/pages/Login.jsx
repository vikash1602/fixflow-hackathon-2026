import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitch }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to login. Check your credentials."
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
          <p className="eyebrow">CAMPUS ISSUE MANAGEMENT</p>
          <h1>
            Report problems.
            <br />
            Track progress.
            <br />
            <span>Get them resolved.</span>
          </h1>
          <p>
            A simple platform for reporting campus issues
            and following their resolution from start to finish.
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
            <h2>Welcome back</h2>
            <p>Sign in to manage your reported issues.</p>
          </div>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
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
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="primary-button full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button onClick={onSwitch}>
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}