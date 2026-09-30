import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/my-bookings/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }
        return data;
      })
      .then((data) => {
        setBookings(data.bookings || []);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "REJECTED"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

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

  return (
    <div style={styles.container}>
      {/* Hero Welcome Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.badgeRow}>
            <span style={styles.greetingBadge}>EMPLOYEE PORTAL</span>
            <span style={styles.dateText}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {user.username || "Team Member"}!
          </h1>
          <p style={styles.welcomeSubtitle}>
            Need a quiet space for team sprints, client pitches, or board meetings? Reserve the GyanMatrix Conference Hall easily.
          </p>
          <div style={styles.heroActions}>
            <button
              onClick={() => navigate("/employee/booking")}
              style={styles.ctaPrimaryBtn}
            >
              ✨ Book Conference Hall Now
            </button>
            <button
              onClick={() => navigate("/employee/my-bookings")}
              style={styles.ctaSecondaryBtn}
            >
              📋 View All My Bookings
            </button>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.hallQuickCard}>
            <div style={styles.hallCardHeader}>
              <span style={styles.hallIcon}>🏛️</span>
              <div>
                <h4 style={styles.hallName}>Main Conference Hall</h4>
                <p style={styles.hallStatus}>🟢 Available for Booking</p>
              </div>
            </div>
            <div style={styles.amenitiesGrid}>
              <span style={styles.amenityTag}>🪑 Up to 7 Chairs</span>
              <span style={styles.amenityTag}>📽️ 4K Projector</span>
              <span style={styles.amenityTag}>📶 High-speed Wi-Fi</span>
              <span style={styles.amenityTag}>🎙️ Video Conf System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Statistics Grid */}
      <div style={styles.statsSection}>
        <h3 style={styles.sectionHeading}>Booking Overview</h3>
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderTop: "4px solid #23737a" }}>
            <div style={styles.statTop}>
              <span style={styles.statLabel}>Total Requests</span>
              <span style={styles.statEmoji}>📊</span>
            </div>
            <h2 style={styles.statNumber}>{loading ? "..." : bookings.length}</h2>
            <span style={styles.statNote}>All-time submissions</span>
          </div>

          <div style={{ ...styles.statCard, borderTop: "4px solid #f59e0b" }}>
            <div style={styles.statTop}>
              <span style={styles.statLabel}>Pending Review</span>
              <span style={styles.statEmoji}>⏳</span>
            </div>
            <h2 style={{ ...styles.statNumber, color: "#b45309" }}>
              {loading ? "..." : pendingBookings}
            </h2>
            <span style={styles.statNote}>Awaiting admin response</span>
          </div>

          <div style={{ ...styles.statCard, borderTop: "4px solid #10b981" }}>
            <div style={styles.statTop}>
              <span style={styles.statLabel}>Approved</span>
              <span style={styles.statEmoji}>✅</span>
            </div>
            <h2 style={{ ...styles.statNumber, color: "#047857" }}>
              {loading ? "..." : approvedBookings}
            </h2>
            <span style={styles.statNote}>Confirmed reservations</span>
          </div>

          <div style={{ ...styles.statCard, borderTop: "4px solid #ef4444" }}>
            <div style={styles.statTop}>
              <span style={styles.statLabel}>Rejected</span>
              <span style={styles.statEmoji}>❌</span>
            </div>
            <h2 style={{ ...styles.statNumber, color: "#b91c1c" }}>
              {loading ? "..." : rejectedBookings}
            </h2>
            <span style={styles.statNote}>Declined requests</span>
          </div>

          <div style={{ ...styles.statCard, borderTop: "4px solid #64748b" }}>
            <div style={styles.statTop}>
              <span style={styles.statLabel}>Cancelled</span>
              <span style={styles.statEmoji}>⛔</span>
            </div>
            <h2 style={{ ...styles.statNumber, color: "#475569" }}>
              {loading ? "..." : cancelledBookings}
            </h2>
            <span style={styles.statNote}>Revoked by user</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Bookings & Quick Actions */}
      <div style={styles.twoColumnGrid}>
        {/* Left Column: Recent Bookings */}
        <div style={styles.recentBookingsCard}>
          <div style={styles.cardHeaderRow}>
            <div>
              <h3 style={styles.cardTitle}>Recent Booking Requests</h3>
              <p style={styles.cardSub}>Latest conference hall reservations</p>
            </div>
            {bookings.length > 5 && (
              <button
                onClick={() => navigate("/employee/my-bookings")}
                style={styles.viewAllBtn}
              >
                View All ({bookings.length}) →
              </button>
            )}
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              <span style={styles.spinner} />
              <p>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📅</span>
              <h4 style={styles.emptyTitle}>No bookings yet</h4>
              <p style={styles.emptyText}>
                You haven't requested any conference room slots yet.
              </p>
              <button
                onClick={() => navigate("/employee/booking")}
                style={styles.emptyActionBtn}
              >
                Book Your First Slot
              </button>
            </div>
          ) : (
            <div style={styles.bookingsList}>
              {bookings.slice(0, 5).map((booking) => {
                const badge = getStatusBadge(booking.status);
                return (
                  <div key={booking.id} style={styles.bookingRow}>
                    <div style={styles.bookingLeft}>
                      <div style={styles.datePill}>
                        <span style={styles.dateDay}>
                          {booking.booking_date?.split("-")[2] || "•"}
                        </span>
                        <span style={styles.dateMonth}>
                          {booking.booking_date?.split("-")[1]
                            ? new Date(booking.booking_date).toLocaleString(
                                "default",
                                { month: "short" }
                              )
                            : ""}
                        </span>
                      </div>
                      <div style={styles.bookingInfo}>
                        <h4 style={styles.bookingPurpose}>
                          {booking.purpose || "Conference Meeting"}
                        </h4>
                        <div style={styles.bookingMeta}>
                          <span>
                            🕐 {booking.start_time} - {booking.end_time}
                          </span>
                          <span>•</span>
                          <span>🪑 {booking.chairs_required || 1} Chairs</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.bookingRight}>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Portal Shortcuts */}
        <div style={styles.shortcutsCard}>
          <h3 style={styles.cardTitle}>Quick Portal Shortcuts</h3>
          <p style={styles.cardSub}>Direct navigation to your account tools</p>

          <div style={styles.shortcutsList}>
            <div
              onClick={() => navigate("/employee/booking")}
              style={styles.shortcutItem}
            >
              <div style={{ ...styles.shortcutIconBox, backgroundColor: "#e8f5f6" }}>
                ✨
              </div>
              <div style={styles.shortcutText}>
                <h4>Reserve Conference Hall</h4>
                <p>Pick date, slot times, and chairs required</p>
              </div>
              <span style={styles.arrowIcon}>→</span>
            </div>

            <div
              onClick={() => navigate("/employee/my-activity")}
              style={styles.shortcutItem}
            >
              <div style={{ ...styles.shortcutIconBox, backgroundColor: "#fef3c7" }}>
                📈
              </div>
              <div style={styles.shortcutText}>
                <h4>My Activity Log</h4>
                <p>Review submission and approval history</p>
              </div>
              <span style={styles.arrowIcon}>→</span>
            </div>

            <div
              onClick={() => navigate("/employee/notifications")}
              style={styles.shortcutItem}
            >
              <div style={{ ...styles.shortcutIconBox, backgroundColor: "#e0f2fe" }}>
                🔔
              </div>
              <div style={styles.shortcutText}>
                <h4>Notification Center</h4>
                <p>Real-time booking confirmations & updates</p>
              </div>
              <span style={styles.arrowIcon}>→</span>
            </div>

            <div
              onClick={() => navigate("/employee/profile")}
              style={styles.shortcutItem}
            >
              <div style={{ ...styles.shortcutIconBox, backgroundColor: "#f3e8ff" }}>
                👤
              </div>
              <div style={styles.shortcutText}>
                <h4>Manage Profile</h4>
                <p>Update phone number and account details</p>
              </div>
              <span style={styles.arrowIcon}>→</span>
            </div>

            <div
              onClick={() => navigate("/employee/change-password")}
              style={styles.shortcutItem}
            >
              <div style={{ ...styles.shortcutIconBox, backgroundColor: "#fce7f3" }}>
                🔑
              </div>
              <div style={styles.shortcutText}>
                <h4>Account Security</h4>
                <p>Change your login password securely</p>
              </div>
              <span style={styles.arrowIcon}>→</span>
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
    gap: "32px",
  },

  heroBanner: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #172554 50%, #1e3a47 100%)",
    borderRadius: "24px",
    padding: "36px 40px",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "32px",
    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
    flexWrap: "wrap",
  },

  heroLeft: {
    flex: "1 1 500px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  greetingBadge: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    color: "#2dd4bf",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(45, 212, 191, 0.3)",
  },

  dateText: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  welcomeTitle: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#ffffff",
    margin: 0,
    lineHeight: 1.2,
  },

  welcomeSubtitle: {
    fontSize: "14.5px",
    lineHeight: 1.6,
    color: "#cbd5e1",
    margin: 0,
    maxWidth: "600px",
  },

  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "8px",
    flexWrap: "wrap",
  },

  ctaPrimaryBtn: {
    padding: "12px 24px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14.5px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(35, 115, 122, 0.4)",
    transition: "all 0.2s ease",
  },

  ctaSecondaryBtn: {
    padding: "11px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  heroRight: {
    flex: "0 0 340px",
  },

  hallQuickCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  },

  hallCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },

  hallIcon: {
    fontSize: "28px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "8px",
    borderRadius: "10px",
  },

  hallName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 2px 0",
  },

  hallStatus: {
    fontSize: "12px",
    color: "#34d399",
    margin: 0,
    fontWeight: "600",
  },

  amenitiesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  amenityTag: {
    fontSize: "12px",
    color: "#e2e8f0",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    padding: "6px 8px",
    borderRadius: "6px",
    textAlign: "center",
  },

  statsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  sectionHeading: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
  },

  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
  },

  statEmoji: {
    fontSize: "16px",
  },

  statNumber: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "4px 0",
  },

  statNote: {
    fontSize: "11.5px",
    color: "#94a3b8",
  },

  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "24px",
    alignItems: "start",
  },

  recentBookingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 2px 0",
  },

  cardSub: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },

  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#23737a",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingBox: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
    display: "block",
  },

  emptyTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 6px 0",
  },

  emptyText: {
    fontSize: "13.5px",
    color: "#64748b",
    margin: "0 0 16px 0",
  },

  emptyActionBtn: {
    padding: "10px 18px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
  },

  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  bookingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
    transition: "all 0.2s ease",
  },

  bookingLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  datePill: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    width: "48px",
    height: "48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  dateDay: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },

  dateMonth: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#23737a",
    textTransform: "uppercase",
  },

  bookingInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  bookingPurpose: {
    fontSize: "14.5px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  bookingMeta: {
    fontSize: "12.5px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  bookingRight: {
    display: "flex",
    alignItems: "center",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid",
  },

  shortcutsCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  shortcutsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "16px",
  },

  shortcutItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #edf2f7",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  shortcutIconBox: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  shortcutText: {
    flex: 1,
    textAlign: "left",
  },

  arrowIcon: {
    fontSize: "16px",
    color: "#94a3b8",
    fontWeight: "700",
  },
};

export default EmployeeDashboard;