import { useState } from "react";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all the password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Session expired. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/change-password/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();
      console.log("Change password response:", data);

      if (response.ok) {
        setMessage(data.message || "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(
          data.message || data.detail || data.error || "Unable to change password."
        );
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Unable to connect to the server. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>SECURITY SETTINGS</div>
        <h1 style={styles.title}>Change Password</h1>
        <p style={styles.subtitle}>
          Ensure your account stays protected by updating your credentials
        </p>
      </div>

      <div style={styles.card}>
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

        <form onSubmit={handleChangePassword} style={styles.form}>
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Current Password *</label>
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                style={styles.toggleBtn}
              >
                {showOld ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>New Password * (Min 8 chars)</label>
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={styles.toggleBtn}
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter at least 8 characters"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating Credentials..." : "🔒 Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "540px",
    margin: "0 auto",
    width: "100%",
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

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "36px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
  },

  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    padding: "14px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
    marginBottom: "20px",
  },

  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#1e293b",
  },

  toggleBtn: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#23737a",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  submitBtn: {
    padding: "13px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(35, 115, 122, 0.25)",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },
};

export default ChangePassword;