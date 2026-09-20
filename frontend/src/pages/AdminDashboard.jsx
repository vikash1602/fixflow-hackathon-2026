import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function AdminDashboard({ onLogout }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [assigningIssue, setAssigningIssue] = useState(null);
  const [staffId, setStaffId] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/issues");
      setIssues(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Unable to load issues."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const stats = useMemo(() => {
    return {
      total: issues.length,
      reported: issues.filter((i) => i.status === "REPORTED").length,
      assigned: issues.filter((i) => i.status === "ASSIGNED").length,
      progress: issues.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: issues.filter((i) => i.status === "RESOLVED").length,
    };
  }, [issues]);

  const assignIssue = async (issueId) => {
    if (!staffId) {
      setError("Enter a staff user ID first.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.patch(`/issues/${issueId}/assign`, {
        staff_id: Number(staffId),
      });

      setAssigningIssue(null);
      setStaffId("");
      setMessage("Issue assigned successfully.");

      await loadIssues();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to assign issue."
      );
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      setError("");
      setMessage("");

      await api.patch(`/issues/${issueId}/status`, {
        status,
      });

      setMessage("Issue status updated.");
      await loadIssues();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update issue status."
      );
    }
  };

  const formatStatus = (status) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">F</div>

          <div>
            <h1>FixFlow</h1>
            <span>Administration</span>
          </div>
        </div>

        <div className="admin-user">
          <div className="admin-avatar">A</div>

          <div>
            <strong>FixFlow Admin</strong>
            <small>ADMIN</small>
          </div>

          <button onClick={onLogout} className="admin-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <span className="admin-eyebrow">ADMINISTRATION</span>
            <h2>Admin Dashboard</h2>
            <p>
              Monitor campus issues and manage their resolution.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadIssues}
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="admin-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <section className="admin-stats">
          <div className="admin-stat">
            <span>Total issues</span>
            <strong>{stats.total}</strong>
            <small>All reported issues</small>
          </div>

          <div className="admin-stat">
            <span>Reported</span>
            <strong>{stats.reported}</strong>
            <small>Waiting for assignment</small>
          </div>

          <div className="admin-stat">
            <span>Assigned</span>
            <strong>{stats.assigned}</strong>
            <small>Assigned to staff</small>
          </div>

          <div className="admin-stat">
            <span>In progress</span>
            <strong>{stats.progress}</strong>
            <small>Currently being worked on</small>
          </div>

          <div className="admin-stat">
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
            <small>Successfully completed</small>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>All Issues</h3>
              <p>
                Manage and monitor every issue reported through FixFlow.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty">
              Loading issues...
            </div>
          ) : issues.length === 0 ? (
            <div className="admin-empty">
              No issues have been reported yet.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Assigned Staff</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <td>
                        <div className="issue-main">
                          <strong>{issue.issue_code}</strong>
                          <span>{issue.title}</span>
                          <small>
                            {formatDate(issue.created_at)}
                          </small>
                        </div>
                      </td>

                      <td>{issue.category}</td>

                      <td>
                        <span
                          className={`priority priority-${issue.priority.toLowerCase()}`}
                        >
                          {issue.priority}
                        </span>
                      </td>

                      <td>
                        <span className="status-badge">
                          {formatStatus(issue.status)}
                        </span>
                      </td>

                      <td>
                        User #{issue.reporter_id}
                      </td>

                      <td>
                        {issue.assigned_staff_id
                          ? `Staff #${issue.assigned_staff_id}`
                          : "Not assigned"}
                      </td>

                      <td>
                        <div className="admin-actions">
                          {!issue.assigned_staff_id && (
                            <>
                              {assigningIssue === issue.id ? (
                                <div className="assign-box">
                                  <input
                                    type="number"
                                    placeholder="Staff ID"
                                    value={staffId}
                                    onChange={(e) =>
                                      setStaffId(e.target.value)
                                    }
                                  />

                                  <button
                                    onClick={() =>
                                      assignIssue(issue.id)
                                    }
                                  >
                                    Assign
                                  </button>

                                  <button
                                    className="cancel-button"
                                    onClick={() => {
                                      setAssigningIssue(null);
                                      setStaffId("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="action-button"
                                  onClick={() =>
                                    setAssigningIssue(issue.id)
                                  }
                                >
                                  Assign
                                </button>
                              )}
                            </>
                          )}

                          {issue.assigned_staff_id && (
                            <select
                              value={issue.status}
                              onChange={(e) =>
                                updateStatus(
                                  issue.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="ASSIGNED">
                                Assigned
                              </option>

                              <option value="IN_PROGRESS">
                                In Progress
                              </option>

                              <option value="RESOLVED">
                                Resolved
                              </option>

                              <option value="CLOSED">
                                Closed
                              </option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;