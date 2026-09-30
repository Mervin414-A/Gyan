import { useEffect, useState } from "react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Reject modal state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const url =
        statusFilter === "ALL"
          ? "https://gyanmatrix-backend.onrender.com/api/admin/bookings/"
          : `https://gyanmatrix-backend.onrender.com/api/admin/bookings/?status=${statusFilter}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Admin bookings:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to load bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this booking?"
    );
    if (!confirmApprove) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `https://gyanmatrix-backend.onrender.com/api/admin/bookings/${bookingId}/approve/`,
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
        throw new Error(data.detail || data.message || "Failed to approve booking.");
      }

      setFeedback(data.message || "Booking approved successfully.");
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to approve booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `https://gyanmatrix-backend.onrender.com/api/admin/bookings/${rejectingId}/reject/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejection_reason: rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to reject booking.");
      }

      setFeedback(data.message || "Booking rejected successfully.");
      setRejectingId(null);
      setRejectionReason("");
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to reject booking.");
    } finally {
      setActionLoading(false);
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
      case "COMPLETED":
        return {
          bg: "#e0e7ff",
          color: "#4338ca",
          border: "#c7d2fe",
          label: "Completed",
          icon: "🏁",
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

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (b.purpose || "").toLowerCase().includes(term) ||
      (b.booking_date || "").includes(term) ||
      (b.employee?.username || "").toLowerCase().includes(term) ||
      (b.employee?.employee_id || "").toLowerCase().includes(term);
    return matchesSearch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badge}>RESERVATION OVERSIGHT</div>
          <h1 style={styles.title}>Booking Management</h1>
          <p style={styles.subtitle}>
            Review conference room reservations, confirm schedules, or provide rejection feedback
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          style={styles.refreshBtn}
        >
          🔄 Refresh List
        </button>
      </div>

      {feedback && (
        <div style={styles.alertSuccess}>
          <span>✅</span>
          <span>{feedback}</span>
          <button onClick={() => setFeedback("")} style={styles.closeAlert}>
            ✕
          </button>
        </div>
      )}

      {error && (
        <div style={styles.alertError}>
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError("")} style={styles.closeAlert}>
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div style={styles.controlsBar}>
        <div style={styles.tabButtons}>
          {[
            { id: "ALL", label: "All" },
            { id: "PENDING", label: "Pending" },
            { id: "APPROVED", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
            { id: "CANCELLED", label: "Cancelled" },
            { id: "COMPLETED", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                ...styles.tabBtn,
                ...(statusFilter === tab.id ? styles.tabBtnActive : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by staff, ID, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Bookings Table View */}
      {loading ? (
        <div style={styles.centerBox}>
          <p>Loading booking records...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>📅</span>
          <h3>No bookings found</h3>
          <p>There are no bookings matching the selected status or query.</p>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Staff Member</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Chairs</th>
                <th style={styles.th}>Meeting Purpose</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const badge = getStatusBadge(b.status);
                const isPending = b.status === "PENDING";

                return (
                  <tr key={b.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.staffMeta}>
                        <strong style={styles.staffName}>
                          {b.employee?.username || "Employee"}
                        </strong>
                        <span style={styles.staffId}>
                          ID: {b.employee?.employee_id || "N/A"}
                        </span>
                        <span style={styles.staffEmail}>
                          {b.employee?.email}
                        </span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.dateBlock}>
                        <strong>📅 {b.booking_date}</strong>
                        <span style={styles.timeText}>
                          🕐 {b.start_time} - {b.end_time}
                        </span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.chairsBadge}>
                        🪑 {b.chairs_required || 1}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.purposeText}>
                        {b.purpose || "Conference Meeting"}
                      </div>
                      {b.rejection_reason && (
                        <div style={styles.rejectNote}>
                          <em>Reason: {b.rejection_reason}</em>
                        </div>
                      )}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badgeStatus,
                          backgroundColor: badge.bg,
                          color: badge.color,
                          borderColor: badge.border,
                        }}
                      >
                        {badge.icon} {badge.label}
                      </span>
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      {isPending ? (
                        <div style={styles.actionsRow}>
                          <button
                            onClick={() => handleApprove(b.id)}
                            disabled={actionLoading}
                            style={styles.approveBtn}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(b.id);
                              setRejectionReason("");
                            }}
                            disabled={actionLoading}
                            style={styles.rejectBtn}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span style={styles.noActionText}>No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Rejection Reason Modal */}
      {rejectingId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Reject Booking Request</h3>
              <button
                onClick={() => setRejectingId(null)}
                style={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>
            <p style={styles.modalSubtitle}>
              Please provide a clear reason so the employee understands why their reservation was declined.
            </p>

            <form onSubmit={submitReject}>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Hall reserved for executive board meeting, conflict with maintenance schedule..."
                rows="4"
                style={styles.modalTextarea}
                required
                autoFocus
              />

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  style={styles.cancelModalBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={styles.confirmRejectBtn}
                >
                  {actionLoading ? "Submitting..." : "Confirm Rejection"}
                </button>
              </div>
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

  refreshBtn: {
    padding: "9px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#334155",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  },

  alertSuccess: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    justifyContent: "space-between",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
  },

  closeAlert: {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontWeight: "700",
  },

  controlsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#ffffff",
    padding: "14px 20px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },

  tabButtons: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  tabBtn: {
    padding: "8px 14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
  },

  tabBtnActive: {
    backgroundColor: "#23737a",
    color: "#ffffff",
    borderColor: "#23737a",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "8px 14px",
    minWidth: "280px",
  },

  searchIcon: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    width: "100%",
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
    fontSize: "44px",
    display: "block",
    marginBottom: "12px",
  },

  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  theadRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },

  th: {
    padding: "14px 20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "16px 20px",
    fontSize: "13.5px",
    color: "#0f172a",
    verticalAlign: "middle",
  },

  staffMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  staffName: {
    color: "#0f172a",
  },

  staffId: {
    fontSize: "12px",
    color: "#23737a",
    fontWeight: "600",
  },

  staffEmail: {
    fontSize: "12px",
    color: "#64748b",
  },

  dateBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  timeText: {
    fontSize: "12.5px",
    color: "#64748b",
  },

  chairsBadge: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12.5px",
  },

  purposeText: {
    fontWeight: "500",
    maxWidth: "240px",
  },

  rejectNote: {
    fontSize: "12px",
    color: "#b91c1c",
    marginTop: "4px",
  },

  badgeStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11.5px",
    fontWeight: "700",
    border: "1px solid",
  },

  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },

  approveBtn: {
    padding: "6px 14px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  rejectBtn: {
    padding: "6px 14px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  noActionText: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    width: "480px",
    maxWidth: "100%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  modalTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
  },

  closeModalBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#64748b",
  },

  modalSubtitle: {
    fontSize: "13.5px",
    color: "#64748b",
    margin: "0 0 16px 0",
    lineHeight: 1.5,
  },

  modalTextarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
    marginBottom: "20px",
    fontFamily: "inherit",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelModalBtn: {
    padding: "10px 18px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
  },

  confirmRejectBtn: {
    padding: "10px 18px",
    backgroundColor: "#b91c1c",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default AdminBookings;