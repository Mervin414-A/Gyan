import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Interactive filters
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/api/my-bookings/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("My bookings:", data);

      if (response.ok) {
        setBookings(data.bookings || data || []);
      } else {
        setError(data.error || data.message || "Failed to load bookings.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    setCancellingId(bookingId);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `https://gyanmatrix-backend.onrender.com/api/my-bookings/${bookingId}/cancel/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Booking cancelled successfully.");
        fetchMyBookings();
      } else {
        setError(data.error || data.message || "Unable to cancel booking.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setCancellingId(null);
    }
  };

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

  // Filter bookings by status and search
  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === "ALL" || b.status === activeTab;
    const matchesSearch =
      (b.purpose || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.booking_date || "").includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badge}>RESERVATIONS</div>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>
            Manage and track the status of all your conference hall requests
          </p>
        </div>

        <button
          onClick={() => navigate("/employee/booking")}
          style={styles.newBookingBtn}
        >
          ✨ New Booking Request
        </button>
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

      {/* Filter Tabs & Search Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.tabButtons}>
          {[
            { id: "ALL", label: "All Bookings", count: bookings.length },
            {
              id: "PENDING",
              label: "Pending",
              count: bookings.filter((b) => b.status === "PENDING").length,
            },
            {
              id: "APPROVED",
              label: "Approved",
              count: bookings.filter((b) => b.status === "APPROVED").length,
            },
            {
              id: "REJECTED",
              label: "Rejected",
              count: bookings.filter((b) => b.status === "REJECTED").length,
            },
            {
              id: "CANCELLED",
              label: "Cancelled",
              count: bookings.filter((b) => b.status === "CANCELLED").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabBtn,
                ...(activeTab === tab.id ? styles.tabBtnActive : {}),
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  ...styles.tabCount,
                  ...(activeTab === tab.id ? styles.tabCountActive : {}),
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by purpose or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Bookings Display */}
      {loading ? (
        <div style={styles.centerState}>
          <p>Loading your bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>📅</span>
          <h3 style={styles.emptyTitle}>No matching bookings found</h3>
          <p style={styles.emptySub}>
            {activeTab !== "ALL" || searchTerm
              ? "Try adjusting your filter or search criteria."
              : "You haven't made any conference room bookings yet."}
          </p>
          <button
            onClick={() => navigate("/employee/booking")}
            style={styles.emptyBtn}
          >
            Create a Booking
          </button>
        </div>
      ) : (
        <div style={styles.cardsGrid}>
          {filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            const canCancel =
              booking.status === "PENDING" || booking.status === "APPROVED";

            return (
              <div key={booking.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.cardDatePill}>
                    <span style={styles.cardDateNum}>
                      {booking.booking_date?.split("-")[2] || "•"}
                    </span>
                    <span style={styles.cardDateMonth}>
                      {booking.booking_date
                        ? new Date(booking.booking_date).toLocaleString(
                            "default",
                            { month: "short" }
                          )
                        : ""}
                    </span>
                  </div>

                  <div style={styles.cardHeaderInfo}>
                    <h3 style={styles.cardPurpose}>
                      {booking.purpose || "Conference Meeting"}
                    </h3>
                    <span style={styles.cardHallName}>
                      🏛️ GM Conference Hall
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

                <div style={styles.cardBody}>
                  <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Time Slot</span>
                      <span style={styles.metaValue}>
                        🕐 {booking.start_time} - {booking.end_time}
                      </span>
                    </div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Chairs Requested</span>
                      <span style={styles.metaValue}>
                        🪑 {booking.chairs_required || 1} Chairs
                      </span>
                    </div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Requested Date</span>
                      <span style={styles.metaValue}>
                        📅 {booking.booking_date}
                      </span>
                    </div>
                  </div>
                </div>

                {canCancel && (
                  <div style={styles.cardFooter}>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      style={styles.cancelBtn}
                    >
                      {cancellingId === booking.id
                        ? "Cancelling..."
                        : "⛔ Cancel Booking"}
                    </button>
                  </div>
                )}
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
    margin: "0 0 6px 0",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },

  newBookingBtn: {
    padding: "11px 20px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(35, 115, 122, 0.25)",
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

  controlsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },

  tabButtons: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  tabBtnActive: {
    backgroundColor: "#23737a",
    color: "#ffffff",
    borderColor: "#23737a",
  },

  tabCount: {
    backgroundColor: "#e2e8f0",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "10px",
  },

  tabCountActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    color: "#ffffff",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "6px 12px",
    minWidth: "260px",
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
    width: "100%",
    outline: "none",
  },

  centerState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "48px 24px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },

  emptyIcon: {
    fontSize: "44px",
    display: "block",
    marginBottom: "12px",
  },

  emptyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 6px 0",
  },

  emptySub: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 20px 0",
  },

  emptyBtn: {
    padding: "10px 20px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px",
    borderBottom: "1px solid #f1f5f9",
  },

  cardDatePill: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    width: "48px",
    height: "48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardDateNum: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },

  cardDateMonth: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#23737a",
    textTransform: "uppercase",
  },

  cardHeaderInfo: {
    flex: 1,
    overflow: "hidden",
  },

  cardPurpose: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },

  cardHallName: {
    fontSize: "12px",
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
    flexShrink: 0,
  },

  cardBody: {
    padding: "18px",
    flex: 1,
  },

  metaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  metaLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
  },

  metaValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  cardFooter: {
    padding: "12px 18px",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "flex-end",
  },

  cancelBtn: {
    padding: "6px 12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default MyBookings;