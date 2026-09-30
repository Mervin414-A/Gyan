import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_employees: 0,
    total_bookings: 0,
    pending_bookings: 0,
    approved_bookings: 0,
    rejected_bookings: 0,
    cancelled_bookings: 0,
    completed_bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/admin/dashboard/stats/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Dashboard stats:", data);

      if (response.ok) {
        setStats(data);
      } else {
        setError(data.error || "Failed to load dashboard statistics");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerBox}>
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerLeft}>
          <div style={styles.badge}>ADMINISTRATIVE CONSOLE</div>
          <h1 style={styles.title}>GyanMatrix Administration</h1>
          <p style={styles.subtitle}>
            Overview of conference hall utilization, pending approvals, and staff directory.
          </p>
        </div>

        <div style={styles.bannerActions}>
          <button
            onClick={() => navigate("/admin/bookings")}
            style={styles.actionBtnPrimary}
          >
            📋 Manage Bookings ({stats.pending_bookings} Pending)
          </button>
          <button
            onClick={() => navigate("/admin/employees")}
            style={styles.actionBtnSecondary}
          >
            👥 Staff Directory
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.alertError}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={styles.kpiGrid}>
        <div
          onClick={() => navigate("/admin/employees")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #23737a" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Total Staff</span>
            <span style={styles.kpiIcon}>👥</span>
          </div>
          <h2 style={styles.kpiValue}>{stats.total_employees}</h2>
          <span style={styles.kpiSub}>Registered employees</span>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #3b82f6" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Total Bookings</span>
            <span style={styles.kpiIcon}>📊</span>
          </div>
          <h2 style={styles.kpiValue}>{stats.total_bookings}</h2>
          <span style={styles.kpiSub}>All-time reservations</span>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #f59e0b" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Pending Approval</span>
            <span style={styles.kpiIcon}>⏳</span>
          </div>
          <h2 style={{ ...styles.kpiValue, color: "#b45309" }}>
            {stats.pending_bookings}
          </h2>
          <span style={styles.kpiSub}>Requires immediate review</span>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #10b981" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Approved</span>
            <span style={styles.kpiIcon}>✅</span>
          </div>
          <h2 style={{ ...styles.kpiValue, color: "#047857" }}>
            {stats.approved_bookings}
          </h2>
          <span style={styles.kpiSub}>Confirmed slots</span>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #ef4444" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Rejected</span>
            <span style={styles.kpiIcon}>❌</span>
          </div>
          <h2 style={{ ...styles.kpiValue, color: "#b91c1c" }}>
            {stats.rejected_bookings}
          </h2>
          <span style={styles.kpiSub}>Declined requests</span>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #64748b" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Cancelled</span>
            <span style={styles.kpiIcon}>⛔</span>
          </div>
          <h2 style={{ ...styles.kpiValue, color: "#475569" }}>
            {stats.cancelled_bookings}
          </h2>
          <span style={styles.kpiSub}>Revoked reservations</span>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          style={{ ...styles.kpiCard, borderTop: "4px solid #8b5cf6" }}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Completed</span>
            <span style={styles.kpiIcon}>🏁</span>
          </div>
          <h2 style={{ ...styles.kpiValue, color: "#6d28d9" }}>
            {stats.completed_bookings}
          </h2>
          <span style={styles.kpiSub}>Concluded meetings</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div style={styles.hubGrid}>
        <div style={styles.hubCard}>
          <h3 style={styles.hubTitle}>Administrative Shortcuts</h3>
          <p style={styles.hubDesc}>Quick tools to configure and maintain portal</p>

          <div style={styles.shortcutList}>
            <div
              onClick={() => navigate("/admin/bookings")}
              style={styles.shortcutItem}
            >
              <span style={styles.shortcutIcon}>📅</span>
              <div style={styles.shortcutText}>
                <h4>Review Bookings</h4>
                <p>Approve, reject, or filter employee reservations</p>
              </div>
              <span style={styles.shortcutArrow}>→</span>
            </div>

            <div
              onClick={() => navigate("/admin/employees")}
              style={styles.shortcutItem}
            >
              <span style={styles.shortcutIcon}>👥</span>
              <div style={styles.shortcutText}>
                <h4>Employee Management</h4>
                <p>Toggle booking permissions & audit registered staff</p>
              </div>
              <span style={styles.shortcutArrow}>→</span>
            </div>

            <div
              onClick={() => navigate("/admin/reports")}
              style={styles.shortcutItem}
            >
              <span style={styles.shortcutIcon}>📈</span>
              <div style={styles.shortcutText}>
                <h4>Analytics & Reports</h4>
                <p>Utilization metrics and conference hall statistics</p>
              </div>
              <span style={styles.shortcutArrow}>→</span>
            </div>

            <div
              onClick={() => navigate("/admin/settings")}
              style={styles.shortcutItem}
            >
              <span style={styles.shortcutIcon}>⚙️</span>
              <div style={styles.shortcutText}>
                <h4>System Configuration</h4>
                <p>Operating hours, max chairs, and notification settings</p>
              </div>
              <span style={styles.shortcutArrow}>→</span>
            </div>
          </div>
        </div>

        {/* Conference Hall Status Card */}
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <span style={styles.statusIcon}>🏛️</span>
            <div>
              <h3 style={styles.statusTitle}>GM Conference Hall</h3>
              <span style={styles.onlineBadge}>🟢 System Active</span>
            </div>
          </div>

          <p style={styles.statusDesc}>
            Primary corporate meeting venue with presentation and audio hardware.
          </p>

          <div style={styles.specsList}>
            <div style={styles.specRow}>
              <span>Maximum Seating:</span>
              <strong>7 Executive Chairs</strong>
            </div>
            <div style={styles.specRow}>
              <span>Standard Hours:</span>
              <strong>09:00 AM - 06:00 PM</strong>
            </div>
            <div style={styles.specRow}>
              <span>Max Duration:</span>
              <strong>120 Minutes per slot</strong>
            </div>
            <div style={styles.specRow}>
              <span>Approval Rule:</span>
              <strong>Admin Confirmation Required</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  centerBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  banner: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  bannerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  badge: {
    alignSelf: "flex-start",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#23737a",
    backgroundColor: "#e8f5f6",
    padding: "4px 10px",
    borderRadius: "6px",
    marginBottom: "4px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },

  bannerActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  actionBtnPrimary: {
    padding: "11px 20px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(35, 115, 122, 0.25)",
  },

  actionBtnSecondary: {
    padding: "11px 18px",
    backgroundColor: "#f8fafc",
    color: "#334155",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
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

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },

  kpiCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  kpiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  kpiTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
  },

  kpiIcon: {
    fontSize: "18px",
  },

  kpiValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "6px 0 2px 0",
  },

  kpiSub: {
    fontSize: "11.5px",
    color: "#94a3b8",
  },

  hubGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "24px",
    alignItems: "start",
  },

  hubCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  hubTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 2px 0",
  },

  hubDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 18px 0",
  },

  shortcutList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  shortcutItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 14px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #edf2f7",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  shortcutIcon: {
    fontSize: "20px",
    backgroundColor: "#ffffff",
    padding: "8px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  shortcutText: {
    flex: 1,
  },

  shortcutArrow: {
    fontSize: "16px",
    color: "#94a3b8",
    fontWeight: "700",
  },

  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  statusHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "12px",
  },

  statusIcon: {
    fontSize: "28px",
    backgroundColor: "#e8f5f6",
    padding: "10px",
    borderRadius: "12px",
  },

  statusTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 2px 0",
  },

  onlineBadge: {
    fontSize: "11px",
    color: "#047857",
    fontWeight: "700",
  },

  statusDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 20px 0",
    lineHeight: 1.5,
  },

  specsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
    fontSize: "13px",
  },

  specRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#334155",
  },
};

export default AdminDashboard;