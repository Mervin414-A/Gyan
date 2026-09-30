import { useEffect, useState } from "react";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/notifications/",
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
          data.detail || data.message || "Failed to load notifications."
        );
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/notifications/${notificationId}/read/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to mark notification as read."
        );
      }

      setNotifications((previous) =>
        previous.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );

      setMessage("Notification marked as read.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/notifications/read-all/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to mark all as read."
        );
      }

      setNotifications((previous) =>
        previous.map((n) => ({
          ...n,
          is_read: true,
        }))
      );

      setMessage(
        data.updated_count !== undefined
          ? `${data.updated_count} notification(s) marked as read.`
          : "All notifications marked as read."
      );
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "BOOKING_SUBMITTED":
        return "📋";
      case "BOOKING_APPROVED":
        return "✅";
      case "BOOKING_REJECTED":
        return "❌";
      case "BOOKING_CANCELLED":
        return "🚫";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.is_read;
    return true;
  });

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badge}>ADMIN DISPATCH</div>
          <h1 style={styles.title}>System Notifications</h1>
          <p style={styles.subtitle}>
            Audit log of all reservation requests, confirmations, cancellations, and staff actions
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={styles.markAllBtn}>
            ✓ Mark All as Read ({unreadCount})
          </button>
        )}
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

      {/* Tabs */}
      <div style={styles.filterTabs}>
        <button
          onClick={() => setFilter("ALL")}
          style={{
            ...styles.tabBtn,
            ...(filter === "ALL" ? styles.tabBtnActive : {}),
          }}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          style={{
            ...styles.tabBtn,
            ...(filter === "UNREAD" ? styles.tabBtnActive : {}),
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div style={styles.centerBox}>
          <p>Loading notification events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>🔔</span>
          <h3 style={styles.emptyTitle}>
            {filter === "UNREAD" ? "No unread alerts" : "No notifications found"}
          </h3>
          <p style={styles.emptySub}>
            New booking requests and staff activity logs will arrive in this feed.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((n) => (
            <div
              key={n.id}
              style={{
                ...styles.item,
                backgroundColor: n.is_read ? "#ffffff" : "#f0fdfa",
                borderColor: n.is_read ? "#e2e8f0" : "#a7f3d0",
              }}
            >
              <div style={styles.iconBox}>
                {getNotificationIcon(n.notification_type)}
              </div>

              <div style={styles.content}>
                <div style={styles.itemTop}>
                  <div style={styles.titleRow}>
                    {!n.is_read && <span style={styles.unreadDot} />}
                    <h3 style={styles.itemTitle}>{n.title}</h3>
                  </div>
                  {n.created_at && (
                    <span style={styles.timestamp}>
                      {new Date(n.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <p style={styles.itemMessage}>{n.message}</p>

                {!n.is_read && (
                  <div style={styles.actionRow}>
                    <button
                      onClick={() => markAsRead(n.id)}
                      style={styles.markBtn}
                    >
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
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

  markAllBtn: {
    padding: "9px 16px",
    backgroundColor: "#ffffff",
    color: "#23737a",
    border: "1.5px solid #23737a",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
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

  filterTabs: {
    display: "flex",
    gap: "8px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "8px",
  },

  tabBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#64748b",
    cursor: "pointer",
  },

  tabBtnActive: {
    backgroundColor: "#e8f5f6",
    color: "#23737a",
    fontWeight: "700",
  },

  centerBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "48px",
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

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "18px 20px",
    borderRadius: "14px",
    border: "1px solid",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
  },

  iconBox: {
    fontSize: "22px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "8px",
    borderRadius: "10px",
    flexShrink: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  content: {
    flex: 1,
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  unreadDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#23737a",
  },

  itemTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  timestamp: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  itemMessage: {
    fontSize: "13.5px",
    color: "#475569",
    margin: "0 0 8px 0",
    lineHeight: 1.5,
  },

  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  markBtn: {
    background: "none",
    border: "none",
    color: "#23737a",
    fontSize: "12.5px",
    fontWeight: "700",
    cursor: "pointer",
    padding: 0,
  },
};

export default AdminNotifications;