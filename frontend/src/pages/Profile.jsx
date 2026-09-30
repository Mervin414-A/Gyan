import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/auth/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Profile:", data);

      if (response.ok) {
        setProfile(data);
        setPhone(data.phone || "");
      } else {
        setError(data.error || data.message || "Failed to load profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/api/auth/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      const data = await response.json();
      console.log("Update profile:", data);

      if (response.ok) {
        setMessage(data.message || "Profile updated successfully!");
        if (data.user) {
          setProfile(data.user);
          setPhone(data.user.phone || "");
        }
      } else {
        setError(data.error || data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerBox}>
        <p>Loading profile details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>ACCOUNT DETAILS</div>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>
          Manage your personal information and conference hall booking access
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

      {profile && (
        <div style={styles.profileGrid}>
          {/* Left: User Avatar & Role Overview */}
          <div style={styles.overviewCard}>
            <div style={styles.avatarBig}>
              {(profile.username || "U").charAt(0).toUpperCase()}
            </div>
            <h2 style={styles.overviewName}>{profile.username}</h2>
            <span style={styles.roleBadge}>{profile.role || "EMPLOYEE"}</span>

            <div style={styles.permissionBox}>
              <div style={styles.permRow}>
                <span>Booking Status:</span>
                <span
                  style={{
                    fontWeight: "700",
                    color: profile.can_book !== false ? "#047857" : "#b91c1c",
                  }}
                >
                  {profile.can_book !== false ? "🟢 Enabled" : "🔴 Restricted"}
                </span>
              </div>
              <div style={styles.permRow}>
                <span>Employee ID:</span>
                <span style={{ fontWeight: "700", color: "#0f172a" }}>
                  {profile.employee_id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Fields & Edit Form */}
          <div style={styles.detailsCard}>
            <h3 style={styles.cardSectionTitle}>Personal Information</h3>

            <div style={styles.readonlyGrid}>
              <div style={styles.fieldBox}>
                <label style={styles.fieldLabel}>Employee ID</label>
                <div style={styles.fieldValue}>
                  {profile.employee_id || "EMP-000"}
                </div>
              </div>

              <div style={styles.fieldBox}>
                <label style={styles.fieldLabel}>Username</label>
                <div style={styles.fieldValue}>{profile.username}</div>
              </div>

              <div style={styles.fieldBox}>
                <label style={styles.fieldLabel}>Official Email</label>
                <div style={styles.fieldValue}>{profile.email || "N/A"}</div>
              </div>

              <div style={styles.fieldBox}>
                <label style={styles.fieldLabel}>Portal Role</label>
                <div style={styles.fieldValue}>{profile.role || "Employee"}</div>
              </div>
            </div>

            <hr style={styles.divider} />

            <form onSubmit={updateProfile} style={styles.editSection}>
              <h3 style={styles.cardSectionTitle}>Update Contact Phone</h3>
              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel}>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.saveBtn,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving Changes..." : "💾 Update Contact Phone"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "960px",
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

  centerBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  profileGrid: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "start",
  },

  overviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px 24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  avatarBig: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    backgroundColor: "#23737a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "800",
    boxShadow: "0 4px 14px rgba(35, 115, 122, 0.3)",
    marginBottom: "16px",
  },

  overviewName: {
    fontSize: "19px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 6px 0",
  },

  roleBadge: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.8px",
    color: "#23737a",
    backgroundColor: "#e8f5f6",
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "24px",
  },

  permissionBox: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "14px",
    border: "1px solid #edf2f7",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontSize: "13px",
  },

  permRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  cardSectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 18px 0",
  },

  readonlyGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  fieldBox: {
    backgroundColor: "#f8fafc",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #edf2f7",
  },

  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    display: "block",
    marginBottom: "4px",
  },

  fieldValue: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },

  divider: {
    margin: "24px 0",
    border: "none",
    borderTop: "1px solid #f1f5f9",
  },

  editSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
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

  saveBtn: {
    alignSelf: "flex-start",
    padding: "11px 22px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(35, 115, 122, 0.2)",
    transition: "all 0.2s ease",
  },
};

export default Profile;