import { useEffect, useState } from "react";

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "https://gyanmatrix-backend.onrender.com/api/auth/admin/reports/",
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
        throw new Error(data.detail || "Failed to load reports");
      }

      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div style={styles.centerBox}>
        <p>Generating reports & utilization statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.alertError}>
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchReports} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const status = reports?.booking_status || {};
  const total = reports?.total_bookings || 1; // avoid / 0

  const approvedPct = Math.round(((status.approved || 0) / total) * 100);
  const pendingPct = Math.round(((status.pending || 0) / total) * 100);
  const rejectedPct = Math.round(((status.rejected || 0) / total) * 100);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badge}>DATA & ANALYTICS</div>
          <h1 style={styles.title}>Reports & Insights</h1>
          <p style={styles.subtitle}>
            Conference hall usage patterns, booking volume, and staff engagement metrics
          </p>
        </div>

        <button onClick={fetchReports} style={styles.refreshBtn}>
          🔄 Refresh Analytics
        </button>
      </div>

      {/* Summary KPI Grid */}
      <div style={styles.kpiGrid}>
        <div style={{ ...styles.kpiCard, borderTop: "4px solid #23737a" }}>
          <span style={styles.kpiLabel}>Total Bookings</span>
          <h2 style={styles.kpiValue}>{reports?.total_bookings ?? 0}</h2>
          <span style={styles.kpiSub}>Total volume submitted</span>
        </div>

        <div style={{ ...styles.kpiCard, borderTop: "4px solid #f59e0b" }}>
          <span style={styles.kpiLabel}>Pending Requests</span>
          <h2 style={{ ...styles.kpiValue, color: "#b45309" }}>
            {status.pending ?? 0}
          </h2>
          <span style={styles.kpiSub}>Pending admin review</span>
        </div>

        <div style={{ ...styles.kpiCard, borderTop: "4px solid #10b981" }}>
          <span style={styles.kpiLabel}>Approved Reservations</span>
          <h2 style={{ ...styles.kpiValue, color: "#047857" }}>
            {status.approved ?? 0}
          </h2>
          <span style={styles.kpiSub}>{approvedPct}% approval rate</span>
        </div>

        <div style={{ ...styles.kpiCard, borderTop: "4px solid #ef4444" }}>
          <span style={styles.kpiLabel}>Rejected</span>
          <h2 style={{ ...styles.kpiValue, color: "#b91c1c" }}>
            {status.rejected ?? 0}
          </h2>
          <span style={styles.kpiSub}>Declined slots</span>
        </div>

        <div style={{ ...styles.kpiCard, borderTop: "4px solid #64748b" }}>
          <span style={styles.kpiLabel}>Cancelled</span>
          <h2 style={{ ...styles.kpiValue, color: "#475569" }}>
            {status.cancelled ?? 0}
          </h2>
          <span style={styles.kpiSub}>Staff revoked</span>
        </div>

        <div style={{ ...styles.kpiCard, borderTop: "4px solid #8b5cf6" }}>
          <span style={styles.kpiLabel}>Completed</span>
          <h2 style={{ ...styles.kpiValue, color: "#6d28d9" }}>
            {status.completed ?? 0}
          </h2>
          <span style={styles.kpiSub}>Successfully hosted</span>
        </div>
      </div>

      {/* Visual Utilization Breakdown */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>Reservation Status Distribution</h3>
          <span style={styles.chartSub}>Breakdown of all requests</span>
        </div>

        {/* Multi-segment visual progress bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressSegment,
              width: `${approvedPct}%`,
              backgroundColor: "#10b981",
            }}
            title={`Approved: ${approvedPct}%`}
          />
          <div
            style={{
              ...styles.progressSegment,
              width: `${pendingPct}%`,
              backgroundColor: "#f59e0b",
            }}
            title={`Pending: ${pendingPct}%`}
          />
          <div
            style={{
              ...styles.progressSegment,
              width: `${rejectedPct}%`,
              backgroundColor: "#ef4444",
            }}
            title={`Rejected: ${rejectedPct}%`}
          />
        </div>

        <div style={styles.legendRow}>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#10b981" }} />
            <span>Approved ({status.approved ?? 0})</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#f59e0b" }} />
            <span>Pending ({status.pending ?? 0})</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#ef4444" }} />
            <span>Rejected ({status.rejected ?? 0})</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#64748b" }} />
            <span>Cancelled ({status.cancelled ?? 0})</span>
          </div>
        </div>
      </div>

      {/* Today and Upcoming Highlights */}
      <div style={styles.highlightGrid}>
        <div style={styles.highlightCard}>
          <div style={styles.highlightTop}>
            <span style={styles.highlightIcon}>📅</span>
            <div>
              <h3 style={styles.highlightTitle}>Today's Activity</h3>
              <span style={styles.highlightDate}>
                {reports?.today?.date || "Today"}
              </span>
            </div>
          </div>
          <h2 style={styles.highlightNumber}>
            {reports?.today?.bookings ?? 0}
          </h2>
          <p style={styles.highlightDesc}>Meetings scheduled for today</p>
        </div>

        <div style={styles.highlightCard}>
          <div style={styles.highlightTop}>
            <span style={styles.highlightIcon}>✨</span>
            <div>
              <h3 style={styles.highlightTitle}>Upcoming Confirmed</h3>
              <span style={styles.highlightDate}>Future Schedule</span>
            </div>
          </div>
          <h2 style={{ ...styles.highlightNumber, color: "#23737a" }}>
            {reports?.upcoming_approved_bookings ?? 0}
          </h2>
          <p style={styles.highlightDesc}>
            Approved bookings scheduled for upcoming dates
          </p>
        </div>
      </div>

      {/* Staff Booking Leaderboard */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.tableTitle}>Staff Engagement Leaderboard</h3>
            <p style={styles.tableSub}>
              Employees with the most room reservations
            </p>
          </div>
        </div>

        {reports?.employee_booking_report?.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Staff ID</th>
                <th style={{ ...styles.th, textAlign: "right" }}>
                  Total Reservations
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.employee_booking_report.map((emp, idx) => (
                <tr key={emp.employee_id || idx} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.empRow}>
                      <div style={styles.rankPill}>#{idx + 1}</div>
                      <strong>{emp.username}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.empIdBadge}>{emp.employee_id}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <span style={styles.countBadge}>
                      {emp.booking_count} bookings
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyTable}>
            <p>No staff booking records found.</p>
          </div>
        )}
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
  },

  alertError: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "13.5px",
  },

  retryBtn: {
    padding: "6px 12px",
    backgroundColor: "#b91c1c",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
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
  },

  kpiLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
  },

  kpiValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "4px 0",
  },

  kpiSub: {
    fontSize: "11.5px",
    color: "#94a3b8",
  },

  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "24px 28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  chartHeader: {
    marginBottom: "16px",
  },

  chartTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 2px 0",
  },

  chartSub: {
    fontSize: "13px",
    color: "#64748b",
  },

  progressBar: {
    height: "12px",
    borderRadius: "6px",
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
    display: "flex",
    marginBottom: "16px",
  },

  progressSegment: {
    height: "100%",
    transition: "width 0.4s ease",
  },

  legendRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    fontSize: "12.5px",
    color: "#475569",
    fontWeight: "600",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  highlightGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  highlightCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  highlightTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },

  highlightIcon: {
    fontSize: "24px",
    backgroundColor: "#f8fafc",
    padding: "8px",
    borderRadius: "10px",
  },

  highlightTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  highlightDate: {
    fontSize: "12px",
    color: "#64748b",
  },

  highlightNumber: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "8px 0 4px 0",
  },

  highlightDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },

  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  tableHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
  },

  tableTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 2px 0",
  },

  tableSub: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
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
    padding: "14px 24px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "14px 24px",
    fontSize: "13.5px",
    color: "#0f172a",
    verticalAlign: "middle",
  },

  empRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  rankPill: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "6px",
  },

  empIdBadge: {
    fontSize: "12.5px",
    color: "#23737a",
    fontWeight: "600",
  },

  countBadge: {
    backgroundColor: "#e8f5f6",
    color: "#23737a",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "12px",
  },

  emptyTable: {
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default AdminReports;