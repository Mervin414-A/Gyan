import { NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/gyanmatrix-logo.png";

function AdminSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/employees", label: "Employees", icon: "👥" },
    { to: "/admin/bookings", label: "Bookings", icon: "📅" },
    { to: "/admin/notifications", label: "Notifications", icon: "🔔" },
    { to: "/admin/reports", label: "Reports", icon: "📈" },
    { to: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        {/* Brand Header */}
        <div style={styles.brandContainer}>
          <div style={styles.logoWrapper}>
            <img
              src={logoImg}
              alt="GyanMatrix"
              style={styles.logoImg}
              onError={(e) => {
                e.target.src = "/gyanmatrix-logo.png";
              }}
            />
          </div>
          <div style={styles.badgePill}>ADMIN CONSOLE</div>
        </div>

        {/* Navigation Items */}
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) =>
                isActive
                  ? { ...styles.link, ...styles.activeLink }
                  : styles.link
              }
            >
              <span style={styles.icon}>{item.icon}</span>
              <span style={styles.linkText}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile & Logout footer */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.adminAvatar}>
            {(user.username || "A").charAt(0).toUpperCase()}
          </div>
          <div style={styles.userMeta}>
            <span style={styles.userName}>{user.username || "Administrator"}</span>
            <span style={styles.userRole}>Super Admin</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          title="Sign Out"
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    padding: "24px 18px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 200,
    borderRight: "1px solid #1e293b",
    boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)",
  },

  brandContainer: {
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  logoWrapper: {
    backgroundColor: "#ffffff",
    padding: "8px 12px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },

  logoImg: {
    height: "26px",
    width: "auto",
    objectFit: "contain",
  },

  badgePill: {
    alignSelf: "flex-start",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#2dd4bf",
    backgroundColor: "rgba(45, 212, 191, 0.12)",
    padding: "3px 8px",
    borderRadius: "6px",
    border: "1px solid rgba(45, 212, 191, 0.2)",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#94a3b8",
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  activeLink: {
    backgroundColor: "rgba(35, 115, 122, 0.25)",
    color: "#38bdf8",
    fontWeight: "600",
    borderLeft: "3px solid #38bdf8",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },

  icon: {
    fontSize: "17px",
    display: "inline-flex",
  },

  linkText: {
    letterSpacing: "0.2px",
  },

  footer: {
    paddingTop: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 8px",
  },

  adminAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow: "0 2px 6px rgba(35, 115, 122, 0.4)",
  },

  userMeta: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  userName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },

  userRole: {
    fontSize: "11px",
    color: "#64748b",
  },

  logoutButton: {
    padding: "10px 14px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
};

export default AdminSidebar;