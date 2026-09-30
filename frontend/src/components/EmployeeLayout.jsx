import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/gyanmatrix-logo.png";

function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { to: "/employee/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/employee/booking", label: "Book Hall", icon: "✨" },
    { to: "/employee/my-bookings", label: "My Bookings", icon: "📅" },
    { to: "/employee/my-activity", label: "Activity", icon: "📈" },
    { to: "/employee/notifications", label: "Notifications", icon: "🔔" },
    { to: "/employee/profile", label: "Profile", icon: "👤" },
    { to: "/employee/change-password", label: "Security", icon: "🔑" },
  ];

  return (
    <div style={styles.layout}>
      {/* Top Navbar with GyanMatrix Logo in Top-Right Corner */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.brandBadge}>
            <span style={styles.pulseDot} />
            <span style={styles.brandTitle}>GyanMatrix Portal</span>
          </div>

          {/* Navigation Links */}
          <nav style={styles.nav}>
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) =>
                  isActive
                    ? { ...styles.navLink, ...styles.navLinkActive }
                    : styles.navLink
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Top-Right Corner: Profile Pill + Official Logo */}
        <div style={styles.headerRight}>
          <div style={styles.userProfilePill}>
            <div style={styles.avatar}>
              {(user.username || "E").charAt(0).toUpperCase()}
            </div>
            <div style={styles.userMeta}>
              <span style={styles.userName}>{user.username || "Employee"}</span>
              <span style={styles.userRole}>Staff Member</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            title="Sign Out"
          >
            🚪 Sign Out
          </button>

          {/* Official GyanMatrix Logo anchored in Top-Right Corner */}
          <div style={styles.logoAnchor}>
            <img
              src={logoImg}
              alt="GyanMatrix Logo"
              style={styles.logoImage}
              onError={(e) => {
                e.target.src = "/gyanmatrix-logo.png";
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.content}>
        <div style={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8fafc",
  },

  header: {
    height: "68px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },

  brandBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "10px",
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
  },

  pulseDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
  },

  brandTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "0.2px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#475569",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  },

  navLinkActive: {
    backgroundColor: "#e8f5f6",
    color: "#23737a",
    fontWeight: "700",
    boxShadow: "inset 0 0 0 1px rgba(35, 115, 122, 0.2)",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  userProfilePill: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#f8fafc",
    padding: "4px 12px 4px 6px",
    borderRadius: "30px",
    border: "1px solid #e2e8f0",
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#23737a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
  },

  userMeta: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },

  userName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0f172a",
  },

  userRole: {
    fontSize: "11px",
    color: "#64748b",
  },

  logoutButton: {
    padding: "7px 12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    fontSize: "12.5px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  logoAnchor: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "6px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },

  logoImage: {
    height: "30px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },

  content: {
    flex: 1,
    padding: "32px 24px",
  },

  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    width: "100%",
  },
};

export default EmployeeLayout;
