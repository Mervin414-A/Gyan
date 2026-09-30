import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/gyanmatrix-logo.png";

function EmployeeRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_id: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Password and Confirm Password do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://gyanmatrix-backend.onrender.com/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Employee account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMsg(data.message || data.error || data.detail || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg(
        "Unable to connect to the server. Please ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Top Header Bar with Top-Right Logo */}
      <header style={styles.topHeader}>
        <div style={styles.headerLeft}>
          <span style={styles.pulseDot} />
          <span style={styles.headerBrand}>GyanMatrix Portal</span>
        </div>

        {/* Top-Right Corner Logo Anchor */}
        <div style={styles.topRightLogoAnchor}>
          <img
            src={logoImg}
            alt="GyanMatrix Logo"
            style={styles.headerLogoImg}
            onError={(e) => {
              e.target.src = "/gyanmatrix-logo.png";
            }}
          />
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.mainContainer}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.logoAnchorCenter}>
              <img
                src={logoImg}
                alt="GyanMatrix"
                style={styles.centerLogoImg}
                onError={(e) => {
                  e.target.src = "/gyanmatrix-logo.png";
                }}
              />
            </div>
            <h1 style={styles.title}>Create Employee Account</h1>
            <p style={styles.subtitle}>
              Register to access the GyanMatrix Conference Hall Booking Portal
            </p>
          </div>

          {errorMsg && (
            <div style={styles.alertError}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={styles.alertSuccess}>
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Employee ID *</label>
                <input
                  type="text"
                  name="employee_id"
                  placeholder="e.g. EMP104"
                  value={formData.employee_id}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Username *</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Official Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@gyanmatrix.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password * (Min 8 chars)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Repeat password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Register Account →"}
            </button>
          </form>

          <div style={styles.footerRow}>
            <span style={styles.footerText}>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={styles.backButton}
            >
              Sign In Instead
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8fafc",
    backgroundImage:
      "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
    backgroundSize: "40px 40px",
    backgroundPosition: "0 0, 20px 20px",
  },

  topHeader: {
    height: "64px",
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  pulseDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
  },

  headerBrand: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },

  topRightLogoAnchor: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "6px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  headerLogoImg: {
    height: "30px",
    width: "auto",
    objectFit: "contain",
  },

  mainContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  card: {
    width: "680px",
    maxWidth: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow:
      "0 20px 40px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.05)",
    boxSizing: "border-box",
  },

  cardHeader: {
    textAlign: "center",
    marginBottom: "28px",
  },

  logoAnchorCenter: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 14px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  centerLogoImg: {
    height: "32px",
    width: "auto",
    objectFit: "contain",
  },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 6px 0",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },

  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
    marginBottom: "20px",
  },

  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  submitBtn: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(35, 115, 122, 0.25)",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },

  footerRow: {
    marginTop: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
  },

  footerText: {
    fontSize: "14px",
    color: "#64748b",
  },

  backButton: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: "700",
    color: "#23737a",
    cursor: "pointer",
    padding: "4px 8px",
  },
};

export default EmployeeRegister;