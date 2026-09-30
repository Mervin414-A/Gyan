import { useEffect, useState } from "react";

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPermission, setFilterPermission] = useState("ALL"); // ALL, ALLOWED, REVOKED

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/admin/employees/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Employees:", data);

      if (response.ok) {
        setEmployees(data.employees || []);
      } else {
        setError(data.error || data.message || "Failed to load employees");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (employeeId, canBook) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/admin/employees/${employeeId}/booking-permission/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            can_book: canBook,
          }),
        }
      );

      const data = await response.json();
      console.log("Permission response:", data);

      if (response.ok) {
        setFeedbackMsg(
          data.message ||
            `Booking permission ${canBook ? "granted" : "revoked"} successfully.`
        );
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === employeeId ? { ...emp, can_book: canBook } : emp
          )
        );
      } else {
        setError(data.error || data.message || "Failed to update permission");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend.");
    }
  };

  const updateStatus = async (employeeId, isActive) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/admin/employees/${employeeId}/status/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: isActive,
          }),
        }
      );

      const data = await response.json();
      console.log("Status response:", data);

      if (response.ok) {
        setFeedbackMsg(
          data.message ||
            `Account ${isActive ? "activated" : "deactivated"} successfully.`
        );
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === employeeId ? { ...emp, is_active: isActive } : emp
          )
        );
      } else {
        setError(data.error || data.message || "Failed to update employee status");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend.");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (emp.username || "").toLowerCase().includes(term) ||
      (emp.email || "").toLowerCase().includes(term) ||
      (emp.employee_id || "").toLowerCase().includes(term) ||
      (emp.phone || "").includes(term);

    const matchesPermission =
      filterPermission === "ALL" ||
      (filterPermission === "ALLOWED" && emp.can_book) ||
      (filterPermission === "REVOKED" && !emp.can_book);

    return matchesSearch && matchesPermission;
  });

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.badge}>STAFF MANAGEMENT</div>
          <h1 style={styles.title}>Employee Directory</h1>
          <p style={styles.subtitle}>
            Manage staff accounts, conference hall reservation privileges, and account status
          </p>
        </div>

        <div style={styles.totalBadge}>
          <span>Total Staff:</span>
          <strong>{employees.length}</strong>
        </div>
      </div>

      {feedbackMsg && (
        <div style={styles.alertSuccess}>
          <span>✅</span>
          <span>{feedbackMsg}</span>
          <button
            onClick={() => setFeedbackMsg("")}
            style={styles.closeAlertBtn}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div style={styles.alertError}>
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError("")} style={styles.closeAlertBtn}>
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Booking Privilege:</span>
          <select
            value={filterPermission}
            onChange={(e) => setFilterPermission(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">All Permissions</option>
            <option value="ALLOWED">Allowed Only</option>
            <option value="REVOKED">Revoked / Restricted</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.centerBox}>
          <p>Loading employee records...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>👥</span>
          <h3>No matching employees</h3>
          <p>Try searching with another query or reset filters.</p>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Booking Access</th>
                <th style={styles.th}>Account Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.employeeCell}>
                      <div style={styles.avatarMini}>
                        {(emp.username || "E").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.empName}>{emp.username}</div>
                        <div style={styles.empId}>
                          ID: {emp.employee_id || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.emailText}>{emp.email}</div>
                    <div style={styles.phoneText}>{emp.phone || "No phone"}</div>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badgePermission,
                        backgroundColor: emp.can_book ? "#ecfdf5" : "#fef2f2",
                        color: emp.can_book ? "#047857" : "#b91c1c",
                        borderColor: emp.can_book ? "#a7f3d0" : "#fecaca",
                      }}
                    >
                      {emp.can_book ? "✓ Allowed" : "✕ Revoked"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badgeStatus,
                        backgroundColor: emp.is_active ? "#ecfdf5" : "#f1f5f9",
                        color: emp.is_active ? "#065f46" : "#475569",
                      }}
                    >
                      <span
                        style={{
                          ...styles.dot,
                          backgroundColor: emp.is_active
                            ? "#10b981"
                            : "#94a3b8",
                        }}
                      />
                      {emp.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <div style={styles.actionsRow}>
                      {/* Permission toggle button */}
                      <button
                        onClick={() => updatePermission(emp.id, !emp.can_book)}
                        style={{
                          ...styles.actionBtn,
                          ...(emp.can_book
                            ? styles.btnRevoke
                            : styles.btnAllow),
                        }}
                        title={emp.can_book ? "Revoke booking privileges" : "Allow booking privileges"}
                      >
                        {emp.can_book ? "Revoke Privilege" : "Allow Booking"}
                      </button>

                      {/* Status toggle button */}
                      <button
                        onClick={() => updateStatus(emp.id, !emp.is_active)}
                        style={{
                          ...styles.actionBtn,
                          ...(emp.is_active
                            ? styles.btnDeactivate
                            : styles.btnActivate),
                        }}
                      >
                        {emp.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

  totalBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    padding: "8px 16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    color: "#475569",
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

  closeAlertBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "inherit",
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

  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  filterLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
    color: "#0f172a",
    backgroundColor: "#ffffff",
    outline: "none",
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
    transition: "background-color 0.15s ease",
  },

  td: {
    padding: "16px 20px",
    fontSize: "13.5px",
    color: "#0f172a",
    verticalAlign: "middle",
  },

  employeeCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatarMini: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#23737a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },

  empName: {
    fontWeight: "700",
    color: "#0f172a",
  },

  empId: {
    fontSize: "12px",
    color: "#64748b",
  },

  emailText: {
    fontWeight: "500",
    color: "#334155",
  },

  phoneText: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  badgePermission: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid",
  },

  badgeStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },

  actionBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.15s ease",
  },

  btnRevoke: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    borderColor: "#fecaca",
  },

  btnAllow: {
    backgroundColor: "#ecfdf5",
    color: "#047857",
    borderColor: "#a7f3d0",
  },

  btnDeactivate: {
    backgroundColor: "#f8fafc",
    color: "#475569",
    borderColor: "#e2e8f0",
  },

  btnActivate: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    borderColor: "#bae6fd",
  },
};

export default AdminEmployees;