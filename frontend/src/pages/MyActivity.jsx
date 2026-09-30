import { useEffect, useState } from "react";

function MyActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch("https://gyanmatrix-backend.onrender.com/api/my-activity/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("My Activity response:", data);

      if (response.ok) {
        setActivities(data.activities || []);
      } else {
        setError(data.message || data.detail || "Unable to load activity.");
      }
    } catch (err) {
      console.error("My Activity error:", err);
      setError(
        "Unable to connect to the server. Please ensure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "#ecfdf5",
          color: "#047857",
          border: "#a7f3d0",
          label: "Approved",
          icon: "✅",
        };
      case "PENDING":
        return {
          bg: "#fffbeb",
          color: "#b45309",
          border: "#fde68a",
          label: "Pending",
          icon: "⏳",
        };
      case "REJECTED":
        return {
          bg: "#fef2f2",
          color: "#b91c1c",
          border: "#fecaca",
          label: "Rejected",
          icon: "❌",
        };
      case "CANCELLED":
        return {
          bg: "#f1f5f9",
          color: "#475569",
          border: "#cbd5e1",
          label: "Cancelled",
          icon: "⛔",
        };
      default:
        return {
          bg: "#f8fafc",
          color: "#334155",
          border: "#e2e8f0",
          label: status,
          icon: "📌",
        };
    }
  };

  const filtered = activities.filter((act) => {
    const term = searchTerm.toLowerCase();
    return (
      (act.purpose || "").toLowerCase().includes(term) ||
      (act.booking_date || "").includes(term) ||
      (act.status || "").toLowerCase().includes(term)
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badge}>HISTORY LOGS</div>
          <h1 style={styles.title}>My Activity</h1>
          <p style={styles.subtitle}>
            Chronological audit of your hall bookings and reservation status changes
          </p>
        </div>

        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {error && (
        <div style={styles.alertError}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={styles.centerBox}>
          <p>Loading activity history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>📈</span>
          <h3 style={styles.emptyTitle}>No activity records found</h3>
          <p style={styles.emptySub}>
            Your future booking submissions and status updates will be logged here.
          </p>
        </div>
      ) : (
        <div style={styles.timeline}>
          {filtered.map((item, index) => {
            const badge = getStatusBadge(item.status);
            return (
              <div key={item.id || index} style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                <div style={styles.activityCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.purposeTitle}>
                        {item.purpose || "Conference Room Reservation"}
                      </h3>
                      <span style={styles.timestampText}>
                        📅 Date: {item.booking_date} • 🕐 {item.start_time} -{" "}
                        {item.end_time}
                      </span>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: badge.bg,
                        color: badge.color,
                        borderColor: badge.border,
                      }}
                    >
                      {badge.icon} {badge.label}
                    </span>
                  </div>

                  <div style={styles.cardMetaRow}>
                    <span style={styles.metaChip}>
                      🪑 {item.chairs_required || 1} Chairs
                    </span>
                    <span style={styles.metaChip}>🏛️ GM Conference Hall</span>
                    {item.created_at && (
                      <span style={styles.loggedTime}>
                        Logged on:{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
    maxWidth: "860px",
    margin: "0 auto",
    width: "100%",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
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

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "8px 14px",
    minWidth: "240px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  },

  searchIcon: {
    fontSize: "14px",
    color: "#94a3b8",
  },

  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    width: "100%",
  },

  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
  },

  centerBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "48px 24px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },

  emptyIcon: {
    fontSize: "40px",
    display: "block",
    marginBottom: "12px",
  },

  emptyTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 6px 0",
  },

  emptySub: {
    fontSize: "13.5px",
    color: "#64748b",
    margin: 0,
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "relative",
    paddingLeft: "24px",
    borderLeft: "2px solid #e2e8f0",
    marginLeft: "10px",
  },

  timelineItem: {
    position: "relative",
  },

  timelineDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#23737a",
    position: "absolute",
    left: "-31px",
    top: "20px",
    border: "2px solid #ffffff",
    boxShadow: "0 0 0 2px #23737a",
  },

  activityCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
    gap: "12px",
  },

  purposeTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },

  timestampText: {
    fontSize: "13px",
    color: "#64748b",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11.5px",
    fontWeight: "700",
    border: "1px solid",
  },

  cardMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },

  metaChip: {
    fontSize: "12px",
    backgroundColor: "#f8fafc",
    color: "#334155",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },

  loggedTime: {
    fontSize: "12px",
    color: "#94a3b8",
    marginLeft: "auto",
  },
};

export default MyActivity;