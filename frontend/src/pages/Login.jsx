import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/gyanmatrix-logo.png";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("https://gyanmatrix-backend.onrender.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // Store JWT tokens
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Store user information
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect based on user role
          if (data.user.role === "ADMIN") {
            navigate("/admin/dashboard");
          } else if (data.user.role === "EMPLOYEE") {
            navigate("/employee/dashboard");
          } else {
            setErrorMsg("Unknown user role. Please contact support.");
          }
        } else {
          setErrorMsg("User information was not returned by the server.");
        }
      } else {
        const error =
          data.error ||
          data.detail ||
          data.message ||
          "Invalid username or password";
        setErrorMsg(error);
      }
    } catch (error) {
      console.error("Login error:", error);
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
        <div style={styles.cardContainer}>
          {/* Left Hero Graphic Section */}
          <div style={styles.heroSection}>
            <div style={styles.heroContent}>
              <div style={styles.heroBadge}>CONFERENCE SUITE</div>
              <h2 style={styles.heroHeading}>
                Smart Hall Booking & Space Management
              </h2>
              <p style={styles.heroDescription}>
                Seamlessly coordinate team meetings, board conferences, and company presentations with real-time room availability.
              </p>

              <div style={styles.featureList}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>⚡</span>
                  <span>Instant slot reservations & status tracking</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🛡️</span>
                  <span>Role-based access & administrative approval</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🔔</span>
                  <span>Real-time email and in-app notifications</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div style={styles.formSection}>
            <div style={styles.formHeader}>
              <div style={styles.logoBadgeInner}>
                <img
                  src={logoImg}
                  alt="GyanMatrix"
                  style={styles.innerLogoImg}
                  onError={(e) => {
                    e.target.src = "/gyanmatrix-logo.png";
                  }}
                />
              </div>
              <h1 style={styles.title}>Welcome Back</h1>
              <p style={styles.subtitle}>
                Sign in to manage conference hall reservations
              </p>
            </div>

            {errorMsg && (
              <div style={styles.errorAlert}>
                <span style={styles.alertIcon}>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
                  autoFocus
                />
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.passwordLabelRow}>
                  <label style={styles.label}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePasswordBtn}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
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
                {loading ? "Authenticating..." : "Sign In to Portal →"}
              </button>
            </form>

            <div style={styles.registerSection}>
              <div style={styles.divider}>
                <span style={styles.dividerText}>Need an account?</span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/employee/register")}
                style={styles.registerButton}
              >
                ➕ Create New Employee Account
              </button>
            </div>
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
    backgroundColor: "#f1f5f9",
    backgroundImage:
      "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f1f5f9 1px)",
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
    letterSpacing: "0.2px",
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
    display: "block",
  },

  mainContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  cardContainer: {
    display: "flex",
    width: "920px",
    maxWidth: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow:
      "0 20px 40px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.05)",
    overflow: "hidden",
  },

  heroSection: {
    flex: "1 1 45%",
    backgroundColor: "#0f172a",
    backgroundImage:
      "linear-gradient(135deg, rgba(35, 115, 122, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
    color: "#ffffff",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  heroBadge: {
    alignSelf: "flex-start",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    color: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(245, 158, 11, 0.3)",
  },

  heroHeading: {
    fontSize: "28px",
    lineHeight: 1.25,
    fontWeight: "700",
    color: "#ffffff",
  },

  heroDescription: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#cbd5e1",
  },

  featureList: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13.5px",
    color: "#f1f5f9",
    fontWeight: "500",
  },

  featureIcon: {
    fontSize: "16px",
  },

  formSection: {
    flex: "1 1 55%",
    padding: "48px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  formHeader: {
    marginBottom: "24px",
    textAlign: "left",
  },

  logoBadgeInner: {
    marginBottom: "16px",
  },

  innerLogoImg: {
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

  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "18px",
  },

  alertIcon: {
    fontSize: "16px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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

  passwordLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  togglePasswordBtn: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#23737a",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
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
    marginTop: "6px",
  },

  registerSection: {
    marginTop: "24px",
  },

  divider: {
    position: "relative",
    textAlign: "center",
    marginBottom: "16px",
  },

  dividerText: {
    fontSize: "12px",
    color: "#94a3b8",
    backgroundColor: "#ffffff",
    padding: "0 10px",
    position: "relative",
    zIndex: 1,
  },

  registerButton: {
    width: "100%",
    padding: "11px",
    backgroundColor: "#f8fafc",
    color: "#334155",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
};

export default Login;
