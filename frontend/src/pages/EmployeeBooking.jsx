import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeBooking() {
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [chairsRequired, setChairsRequired] = useState("1");
  const [purpose, setPurpose] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const quickPurposes = [
    "Sprint Planning",
    "Client Presentation",
    "Product Demo",
    "Team Retrospective",
    "Technical Architecture",
    "All-Hands Sync",
  ];

  // Calculate duration string if times are picked
  const calculateDuration = () => {
    if (!startTime || !endTime) return null;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (totalMinutes <= 0) return "Invalid time range";
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours} hr ${mins} min`;
  };

  const duration = calculateDuration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (startTime >= endTime) {
      setError("End time must be strictly after start time.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You are not logged in. Please sign in again.");
        setLoading(false);
        return;
      }

      const bookingData = {
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        chairs_required: Number(chairsRequired),
        purpose: purpose.trim(),
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch("https://gyanmatrix-backend.onrender.com/api/bookings/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log("Booking status:", response.status, data);

      if (response.ok) {
        setMessage(
          data.message || "Conference hall request submitted successfully!"
        );
        // Clear form
        setBookingDate("");
        setStartTime("");
        setEndTime("");
        setChairsRequired("1");
        setPurpose("");
      } else {
        if (data.message) {
          setError(data.message);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError(JSON.stringify(data));
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header section */}
      <div style={styles.header}>
        <div style={styles.headerBadge}>RESERVATION REQUEST</div>
        <h1 style={styles.title}>Book GM Conference Hall</h1>
        <p style={styles.subtitle}>
          Reserve the conference hall for your team meetings, presentations, or client calls.
        </p>
      </div>

      <div style={styles.contentGrid}>
        {/* Left Side: Booking Form */}
        <div style={styles.formCard}>
          {message && (
            <div style={styles.alertSuccess}>
              <span style={styles.alertIcon}>🎉</span>
              <div>
                <strong>Success!</strong> {message}
                <div style={{ marginTop: "6px" }}>
                  <button
                    onClick={() => navigate("/employee/my-bookings")}
                    style={styles.inlineLinkBtn}
                  >
                    View in My Bookings →
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={styles.alertError}>
              <span style={styles.alertIcon}>⚠️</span>
              <div>
                <strong>Request Failed:</strong> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Booking Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>Booking Date *</span>
                <span style={styles.hint}>Pick reservation day</span>
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={styles.input}
                required
              />
            </div>

            {/* Time Slot Inputs */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span>From Time *</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span>To Time *</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Duration pill badge */}
            {duration && (
              <div
                style={{
                  ...styles.durationBadge,
                  backgroundColor:
                    duration === "Invalid time range" ? "#fef2f2" : "#ecfdf5",
                  color:
                    duration === "Invalid time range" ? "#b91c1c" : "#047857",
                  borderColor:
                    duration === "Invalid time range" ? "#fecaca" : "#a7f3d0",
                }}
              >
                <span>⏱️</span>
                <span>
                  <strong>Calculated Duration:</strong> {duration}
                </span>
              </div>
            )}

            {/* Interactive Chairs Required */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>Chairs Required *</span>
                <span style={styles.hint}>Max 7 chairs available</span>
              </label>

              {/* Interactive Chair Number Pills */}
              <div style={styles.chairPillsRow}>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setChairsRequired(String(num))}
                    style={{
                      ...styles.chairPill,
                      ...(Number(chairsRequired) === num
                        ? styles.chairPillActive
                        : {}),
                    }}
                  >
                    🪑 {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting Purpose */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>Meeting Purpose *</span>
                <span style={styles.hint}>Brief context for admin review</span>
              </label>

              {/* Quick Purpose Chips */}
              <div style={styles.quickChipsRow}>
                {quickPurposes.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    style={styles.quickChip}
                  >
                    + {p}
                  </button>
                ))}
              </div>

              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe your meeting agenda, client name, or team requirement..."
                rows="4"
                style={styles.textarea}
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
              {loading ? "Submitting Request..." : "🚀 Submit Booking Request"}
            </button>
          </form>
        </div>

        {/* Right Side: Hall Specs & Guidelines Card */}
        <div style={styles.sidebar}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>GM Conference Hall Amenities</h3>
            <div style={styles.amenitiesList}>
              <div style={styles.amenityRow}>
                <span style={styles.amenityIcon}>🖥️</span>
                <div>
                  <strong>Ultra-HD Presentation Screen</strong>
                  <p>HDMI & Wireless casting ready</p>
                </div>
              </div>
              <div style={styles.amenityRow}>
                <span style={styles.amenityIcon}>🎙️</span>
                <div>
                  <strong>Polycom Conference Audio</strong>
                  <p>360° omnidirectional microphone</p>
                </div>
              </div>
              <div style={styles.amenityRow}>
                <span style={styles.amenityIcon}>⚡</span>
                <div>
                  <strong>High-Speed LAN & Wi-Fi 6</strong>
                  <p>Gigabit bandwidth for video calls</p>
                </div>
              </div>
              <div style={styles.amenityRow}>
                <span style={styles.amenityIcon}>❄️</span>
                <div>
                  <strong>Climate Controlled</strong>
                  <p>Independent thermostat controls</p>
                </div>
              </div>
            </div>

            <div style={styles.guidelinesBox}>
              <h4 style={styles.guidelinesTitle}>📌 Hall Etiquette</h4>
              <ul style={styles.guidelinesList}>
                <li>Please wrap up meetings 5 minutes prior to next slot.</li>
                <li>Disconnect and turn off projector when done.</li>
                <li>Notify admin in advance for cancellations.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  header: {
    marginBottom: "8px",
  },

  headerBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#23737a",
    backgroundColor: "#e8f5f6",
    padding: "4px 10px",
    borderRadius: "6px",
    marginBottom: "10px",
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

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "28px",
    alignItems: "start",
  },

  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
  },

  alertSuccess: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "13.5px",
    marginBottom: "24px",
  },

  inlineLinkBtn: {
    background: "none",
    border: "none",
    color: "#047857",
    fontWeight: "700",
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
    fontSize: "13px",
  },

  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "13.5px",
    marginBottom: "24px",
  },

  alertIcon: {
    fontSize: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#1e293b",
  },

  hint: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "400",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  durationBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    border: "1px solid",
  },

  chairPillsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  chairPill: {
    flex: "1 1 calc(14% - 10px)",
    minWidth: "60px",
    padding: "10px 8px",
    backgroundColor: "#f8fafc",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#334155",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  chairPillActive: {
    backgroundColor: "#e8f5f6",
    borderColor: "#23737a",
    color: "#23737a",
    fontWeight: "700",
    boxShadow: "0 2px 6px rgba(35, 115, 122, 0.15)",
  },

  quickChipsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "6px",
  },

  quickChip: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#23737a",
    backgroundColor: "#f0fdfa",
    border: "1px solid #ccfbf1",
    padding: "4px 10px",
    borderRadius: "20px",
    cursor: "pointer",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },

  submitBtn: {
    padding: "14px",
    backgroundColor: "#23737a",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(35, 115, 122, 0.3)",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  infoTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 20px 0",
  },

  amenitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  amenityRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },

  amenityIcon: {
    fontSize: "20px",
    backgroundColor: "#f1f5f9",
    padding: "8px",
    borderRadius: "10px",
  },

  guidelinesBox: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
  },

  guidelinesTitle: {
    fontSize: "13.5px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 10px 0",
  },

  guidelinesList: {
    paddingLeft: "18px",
    fontSize: "12.5px",
    color: "#64748b",
    lineHeight: 1.6,
  },
};

export default EmployeeBooking;