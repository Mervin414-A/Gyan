import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/gyanmatrix-logo.png";

function TopNavbar({ role = "public", activeTab = "" }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      {/* Left side: Navigation / Brand Title */}
      <div style={styles.leftContainer}>
        {role === "employee" ? (
          <nav style={styles.navLinks}>
            <Link
              to="/employee/dashboard"
              style={{
                ...styles.navLink,
                ...(activeTab === "dashboard" ? styles.navLinkActive : {}),
              }}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/employee/booking"
              style={{
                ...styles.navLink,
                ...(activeTab === "booking" ? styles.navLinkActive : {}),
              }}
            >
              ➕ Book Hall
            </Link>
            <Link
              to="/employee/my-bookings"
              style={{
                ...styles.navLink,
                ...(activeTab === "my-bookings" ? styles.navLinkActive : {}),
              }}
            >
              📅 My Bookings
            </Link>
            <Link
              to="/employee/my-activity"
              style={{
                ...styles.navLink,
                ...(activeTab === "activity" ? styles.navLinkActive : {}),
              }}
            >
              📈 Activity
            </Link>
            <Link
              to="/employee/profile"
              style={{
                ...styles.navLink,
                ...(activeTab === "profile" ? styles.navLinkActive : {}),
              }}
            >
              👤 Profile
            </Link>
          </nav>
        ) : (
          <div style={styles.taglineBox}>
            <span style={styles.pulseDot} />
            <span style={styles.taglineText}>
              Conference Hall Management Portal
            </span>
          </div>
        )}
      </div>

      {/* Top-Right Corner: GyanMatrix Logo & User Controls */}
      <div style={styles.topRightCorner}>
        {role === "employee" && (
          <div style={styles.userSection}>
            <Link
              to="/employee/notifications"
              style={styles.iconButton}
              title="Notifications"
            >
              🔔
            </Link>
            <div style={styles.userPill}>
              <div style={styles.avatarCircle}>
                {(user.username || "E").charAt(0).toUpperCase()}
              </div>
              <span style={styles.userName}>{user.username || "Employee"}</span>
            </div>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              title="Logout"
            >
              🚪
            </button>
          </div>
        )}

        {/* GyanMatrix Official Logo anchored in Top-Right Corner */}
        <div style={styles.logoAnchorContainer}>
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
  );
}

const styles = {
  header: {
    height: "64px",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px -2px rgba(15, 23, 42, 0.05)",
  },

  leftContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  navLink: {
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
  },

  taglineBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f8fafc",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
  },

  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
    display: "inline-block",
  },

  taglineText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    letterSpacing: "0.2px",
  },

  topRightCorner: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginLeft: "auto",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRight: "1px solid #e2e8f0",
    paddingRight: "16px",
  },

  iconButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    textDecoration: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  userPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    padding: "4px 12px 4px 6px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
  },

  avatarCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#23737a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
  },

  userName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },

  logoutBtn: {
    background: "#fee2e2",
    border: "none",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  logoAnchorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    padding: "6px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
  },

  logoImage: {
    height: "30px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },
};

export default TopNavbar;
