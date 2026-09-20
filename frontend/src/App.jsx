import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import MyIssues from "./pages/MyIssues";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user, loading, logout } = useAuth();
  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("dashboard");

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-box">
          <div className="brand-mark">F</div>
          <h2>FixFlow</h2>
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authPage === "register") {
      return (
        <Register
          onSwitch={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onSwitch={() => setAuthPage("register")}
      />
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (user.role === "ADMIN") {
    return (
      <AdminDashboard onLogout={logout} />
    );
  }

  // =========================
  // USER / STAFF DASHBOARD
  // =========================

  const navigate = (target) => {
    setPage(target);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">F</div>

          <div>
            <strong>FixFlow</strong>
            <span>Issue Resolution System</span>
          </div>
        </div>

        <div className="topbar-user">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="nav-label">
            WORKSPACE
          </div>

          <button
            className={`nav-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              page === "report" ? "active" : ""
            }`}
            onClick={() => navigate("report")}
          >
            <span>＋</span>
            Report Issue
          </button>

          <button
            className={`nav-item ${
              page === "issues" ? "active" : ""
            }`}
            onClick={() => navigate("issues")}
          >
            <span>☷</span>
            My Issues
          </button>

          <div className="sidebar-bottom">
            <div className="system-status">
              <span className="status-dot"></span>
              System operational
            </div>
          </div>
        </aside>

        <main className="main-content">
          {page === "dashboard" && (
            <Dashboard onNavigate={navigate} />
          )}

          {page === "report" && (
            <ReportIssue
              onCreated={() => navigate("issues")}
            />
          )}

          {page === "issues" && (
            <MyIssues />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;