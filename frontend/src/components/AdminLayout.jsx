import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import logoImg from "../assets/gyanmatrix-logo.png";

function AdminLayout() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={styles.layout}>
      <AdminSidebar />

      <div style={styles.mainWrapper}>
        {/* Top Header Bar with Top-Right Logo */}
        <header style={styles.topHeader}>
          <div style={styles.headerLeft}>
            <span style={styles.liveDot} />
            <span style={styles.portalTitle}>Conference Hall Admin System</span>
            <span style={styles.dateBadge}>{currentDate}</span>
          </div>

          {/* Top-Right Logo and Controls */}
          <div style={styles.headerRight}>
            <div style={styles.systemStatus}>
              <span style={styles.statusText}>Server Active</span>
            </div>

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

        {/* Content Outlet */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },

  mainWrapper: {
    marginLeft: "260px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  topHeader: {
    height: "64px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  liveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
  },

  portalTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  dateBadge: {
    fontSize: "12px",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "20px",
    marginLeft: "6px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  systemStatus: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#059669",
    backgroundColor: "#ecfdf5",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid #a7f3d0",
  },

  statusText: {
    letterSpacing: "0.2px",
  },

  logoAnchor: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "6px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.2s ease",
  },

  logoImage: {
    height: "30px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },

  content: {
    padding: "32px",
    flex: 1,
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
};

export default AdminLayout;