import { useState } from "react";
import api from "../services/api";

export default function ReportIssue({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "ROADS",
    priority: "MEDIUM",
  });

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setCreated(null);

    try {
      const response = await api.post(
        "/api/issues",
        form
      );

      setCreated(response.data);

      setForm({
        title: "",
        description: "",
        category: "ROADS",
        priority: "MEDIUM",
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">ISSUE MANAGEMENT</p>
          <h1>Report an issue</h1>
          <p>
            Tell us what needs attention and we'll route it
            to the appropriate team.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {created && (
        <div className="alert success">
          <strong>Issue reported successfully.</strong>
          <br />
          Your issue ID is{" "}
          <strong>{created.issue_code}</strong>.
        </div>
      )}

      <div className="form-card">
        <form onSubmit={submit}>
          <div className="form-section">
            <h3>Issue details</h3>
            <p>
              Provide enough information for staff to
              understand the problem.
            </p>
          </div>

          <label>Issue title</label>
          <input
            value={form.title}
            placeholder="Example: Street light not working"
            onChange={(e) =>
              update("title", e.target.value)
            }
            required
          />

          <label>Description</label>
          <textarea
            rows="6"
            value={form.description}
            placeholder="Describe where the issue is and what is happening..."
            onChange={(e) =>
              update("description", e.target.value)
            }
            required
          />

          <div className="form-grid">
            <div>
              <label>Category</label>

              <select
                value={form.category}
                onChange={(e) =>
                  update("category", e.target.value)
                }
              >
                <option value="ROADS">Roads</option>
                <option value="WATER">Water</option>
                <option value="ELECTRICAL">
                  Electrical
                </option>
                <option value="WASTE">Waste</option>
                <option value="INTERNET">Internet</option>
                <option value="CLEANING">Cleaning</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label>Priority</label>

              <select
                value={form.priority}
                onChange={(e) =>
                  update("priority", e.target.value)
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => onCreated()}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}