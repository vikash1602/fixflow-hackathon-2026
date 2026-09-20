import { useEffect, useState } from "react";
import api from "../services/api";

function statusClass(status) {
  return status.toLowerCase().replace("_", "-");
}

function priorityClass(priority) {
  return priority.toLowerCase();
}

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIssues = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (status) {
        params.issue_status = status;
      }

      const response = await api.get(
        "/api/issues",
        { params }
      );

      setIssues(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load issues."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [status]);

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <p className="eyebrow">MY REPORTS</p>
          <h1>My issues</h1>
          <p>
            Track the issues you have reported.
          </p>
        </div>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">
            In progress
          </option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="issues-card">
        {loading ? (
          <div className="empty-state">
            Loading issues...
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>No issues found</h3>
            <p>
              You haven't reported any issues matching
              this filter.
            </p>
          </div>
        ) : (
          <div className="issue-list">
            {issues.map((issue) => (
              <div
                className="issue-row"
                key={issue.id}
              >
                <div className="issue-main">
                  <div className="issue-code">
                    {issue.issue_code}
                  </div>

                  <h3>{issue.title}</h3>

                  <p>{issue.description}</p>

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
                    className={`priority ${priorityClass(
                      issue.priority
                    )}`}
                  >
                    {issue.priority}
                  </span>

                  <span
                    className={`status ${statusClass(
                      issue.status
                    )}`}
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