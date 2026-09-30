import { useEffect, useState } from "react";

function AdminSettings() {
  const [settings, setSettings] = useState({
    max_booking_duration_minutes: 120,
    min_chairs: 1,
    max_chairs: 7,
    working_start_time: "09:00",
    working_end_time: "18:00",
    email_notifications: true,
    employee_cancellation: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "https://gyanmatrix-backend.onrender.com/api/admin/system-settings/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to load settings."
        );
      }

      setSettings({
        max_booking_duration_minutes:
          data.max_booking_duration_minutes ?? 120,
        min_chairs: data.min_chairs ?? 1,
        max_chairs: data.max_chairs ?? 7,
        working_start_time:
          data.working_start_time?.slice(0, 5) || "09:00",
        working_end_time:
          data.working_end_time?.slice(0, 5) || "18:00",
        email_notifications: data.email_notifications ?? true,
        employee_cancellation: data.employee_cancellation ?? true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        max_booking_duration_minutes: Number(
          settings.max_booking_duration_minutes
        ),
        min_chairs: Number(settings.min_chairs),
        max_chairs: Number(settings.max_chairs),
        working_start_time: settings.working_start_time,
        working_end_time: settings.working_end_time,
        email_notifications: settings.email_notifications,
        employee_cancellation: settings.employee_cancellation,
      };

      const response = await fetch(
        "http://gyanmatrix-backend.onrender.com/api/admin/system-settings/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to update settings."
        );
      }

      setMessage(data.message || "System settings updated successfully.");
      await fetchSettings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerBox}>
        <p>Loading system configuration...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>PORTAL CONFIGURATION</div>
        <h1 style={styles.title}>System Settings</h1>
        <p style={styles.subtitle}>
          Configure global rules for conference hall reservation durations, seating caps, and alerts
        </p>
      </div>

      {message && (
        <div style={styles.alertSuccess}>
          <span>✅</span>
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={styles.alertError}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={styles.form}>
        {/* Booking Rules Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>⏱️</span>
            <div>
              <h3 style={styles.cardTitle}>Booking Constraints</h3>
              <p style={styles.cardSub}>Set duration limits and capacity controls</p>
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Max Booking Duration (Minutes)</label>
              <input
                type="number"
                name="max_booking_duration_minutes"
                value={settings.max_booking_duration_minutes}
                onChange={handleChange}
                min="1"
                style={styles.input}
                required
              />
              <span style={styles.helperText}>Default: 120 minutes (2 hours)</span>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Minimum Chairs</label>
              <input
                type="number"
                name="min_chairs"
                value={settings.min_chairs}
                onChange={handleChange}
                min="1"
                max="7"
                style={styles.input}
                required
              />
              <span style={styles.helperText}>Lowest permitted per booking</span>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Maximum Chairs</label>
              <input
                type="number"
                name="max_chairs"
                value={settings.max_chairs}
                onChange={handleChange}
                min="1"
                max="7"
                style={styles.input}
                required
              />
              <span style={styles.helperText}>Conference room physical limit: 7</span>
            </div>
          </div>
        </div>

        {/* Operating Hours Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🕐</span>
            <div>
              <h3 style={styles.cardTitle}>Operational Hours</h3>
              <p style={styles.cardSub}>Permitted daily hours for reservations</p>
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Working Start Time</label>
              <input
                type="time"
                name="working_start_time"
                value={settings.working_start_time}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Working End Time</label>
              <input
                type="time"
                name="working_end_time"
                value={settings.working_end_time}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>
        </div>

        {/* Preferences & Toggles Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🔔</span>
            <div>
              <h3 style={styles.cardTitle}>System Preferences</h3>
              <p style={styles.cardSub}>Toggle automated dispatch and cancellation permissions</p>
            </div>
          </div>

          <div style={styles.toggleList}>
            <div style={styles.toggleRow}>
              <div>
                <strong style={styles.toggleTitle}>Email Notifications</strong>
                <p style={styles.toggleDesc}>
                  Dispatch automated email notices to employees upon booking status changes
                </p>
              </div>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={settings.email_notifications}
                  onChange={handleChange}
                  style={styles.checkboxHidden}
                />
                <span
                  style={{
                    ...styles.switchTrack,
                    backgroundColor: settings.email_notifications
                      ? "#23737a"
                      : "#cbd5e1",
                  }}
                >
                  <span
                    style={{
                      ...styles.switchThumb,
                      transform: settings.email_notifications
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </span>
              </label>
            </div>

            <div style={styles.toggleRow}>
              <div>
                <strong style={styles.toggleTitle}>Employee Cancellation</strong>
                <p style={styles.toggleDesc}>
                  Permit employees to cancel their own pending or approved bookings
                </p>
              </div>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  name="employee_cancellation"
                  checked={settings.employee_cancellation}
                  onChange={handleChange}
                  style={styles.checkboxHidden}
                />
                <span
                  style={{
                    ...styles.switchTrack,
                    backgroundColor: settings.employee_cancellation
                      ? "#23737a"
                      : "#cbd5e1",
                  }}
                >
                  <span
                    style={{
                      ...styles.switchThumb,
                      transform: settings.employee_cancellation
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.saveBtn,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving Configuration..." : "💾 Save System Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "960px",
  },

  centerBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  header: {
    marginBottom: "4px",
  },

  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#23737a",
    backgroundColor: "#e8f5f6",
    padding: "4px 10px",
    borderRadius: "6px",
    marginBottom: "8px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },

  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "13.5px",
  },

  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "13.5px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  },

  cardIcon: {
    fontSize: "22px",
    backgroundColor: "#f8fafc",
    padding: "8px",
    borderRadius: "10px",
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 2px 0",
  },

  cardSub: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  helperText: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  toggleList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
    gap: "16px",
  },

  toggleTitle: {
    fontSize: "14px",
    color: "#0f172a",
  },

  toggleDesc: {
    fontSize: "12.5px",
    color: "#64748b",
    margin: "2px 0 0 0",
  },

  switch: {
    position: "relative",
    display: "inline-block",
    width: "48px",
    height: "28px",
    flexShrink: 0,
    cursor: "pointer",
  },

  checkboxHidden: {
    opacity: 0,
    width: 0,
    height: 0,
  },

  switchTrack: {
    position: "absolute",
    inset: 0,
    borderRadius: "34px",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    padding: "3px",
  },

  switchThumb: {
    width: "22px",
    height: "22px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  saveBtn: {
    padding: "12px 28px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14.5px",
    fontWeight: "700",
    boxShadow: "0 4px 14px rgba(35, 115, 122, 0.3)",
    transition: "all 0.2s ease",
  },
};

export default AdminSettings;