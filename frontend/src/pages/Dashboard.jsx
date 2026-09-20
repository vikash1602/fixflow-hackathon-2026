import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">FixFlow</div>
          <span className="muted">Issue reporting and resolution</span>
        </div>
        <button className="secondary-button" onClick={logout}>Sign out</button>
      </header>
      <main className="dashboard">
        <section className="welcome-card">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Welcome, {user?.name}</h1>
            <p className="muted">Your account is connected to the FixFlow system.</p>
          </div>
          <div className="role-chip">{user?.role}</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card"><span>Total Issues</span><strong>0</strong></div>
          <div className="stat-card"><span>Active</span><strong>0</strong></div>
          <div className="stat-card"><span>Resolved</span><strong>0</strong></div>
        </section>

        <section className="empty-card">
          <h2>Issue workflow is ready for the next build step</h2>
          <p className="muted">Hour 1 foundation: authentication, PostgreSQL connection, roles, and a responsive dashboard.</p>
        </section>
      </main>
    </div>
  )
}
