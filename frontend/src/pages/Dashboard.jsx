import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard({ onNavigate }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/issues")
      .then((response) => {
        setIssues(response.data);
      })
      .catch(() => {
        setIssues([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const total = issues.length;
  const reported = issues.filter(
    (i) => i.status === "REPORTED"
  ).length;

  const active = issues.filter(
    (i) =>
      i.status === "ASSIGNED" ||
      i.status === "IN_PROGRESS"
  ).length;

  const resolved = issues.filter(
    (i) =>
      i.status === "RESOLVED" ||
      i.status === "CLOSED"
  ).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>
            Keep track of your reported campus issues.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => onNavigate("report")}
        >
          + Report issue
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total issues</span>
          <strong>{loading ? "—" : total}</strong>
          <small>All your reports</small>
        </div>

        <div className="stat-card">
          <span>Reported</span>
          <strong>{loading ? "—" : reported}</strong>
          <small>Awaiting assignment</small>
        </div>

        <div className="stat-card">
          <span>In progress</span>
          <strong>{loading ? "—" : active}</strong>
          <small>Being worked on</small>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{loading ? "—" : resolved}</strong>
          <small>Successfully completed</small>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Recent issues</h2>
          <p>Your latest reports</p>
        </div>

        <button
          className="text-button"
          onClick={() => onNavigate("issues")}
        >
          View all →
        </button>
      </div>

      <div className="issues-card">
        {loading ? (
          <div className="empty-state">
            Loading...
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">+</div>
            <h3>No issues yet</h3>
            <p>
              Report your first campus issue to get started.
            </p>

            <button
              className="primary-button"
              onClick={() => onNavigate("report")}
            >
              Report an issue
            </button>
          </div>
        ) : (
          <div className="issue-list">
            {issues.slice(0, 5).map((issue) => (
              <div
                className="issue-row"
                key={issue.id}
              >
                <div className="issue-main">
                  <div className="issue-code">
                    {issue.issue_code}
                  </div>

                  <h3>{issue.title}</h3>

                  <div className="issue-meta">
                    <span>{issue.category}</span>
                    <span>
                      {new Date(
                        issue.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="issue-side">
                  <span
                    className={`priority ${issue.priority.toLowerCase()}`}
                  >
                    {issue.priority}
                  </span>

                  <span
                    className={`status ${issue.status
                      .toLowerCase()
                      .replace("_", "-")}`}
                  >
                    {issue.status.replace(
                      "_",
                      " "
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}