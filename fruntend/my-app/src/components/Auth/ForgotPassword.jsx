import { useState } from "react";
import API from "../../api";

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Send OTP
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      const res = await API.post("/forgot-password", { phone });
      alert(res.data.message || "OTP sent!");
      setOtpSent(true);
    } catch (err) {
      console.error("Forgot Password Error →", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error sending OTP");
    }
  }; // ✅ Closing brace fixed

  // Reset Password
  const resetPassword = async () => {
    if (!otp || !newPassword) return alert("Enter OTP and new password");

    try {
      const res = await API.post("/verify-otp", { phone, otp, newPassword });
      alert(res.data.message || "Password reset successful!");
      window.location.href = "/login";
    } catch (err) {
      console.error("Reset Password Error →", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid OTP or error resetting password");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={styles.input}
      />

      {!otpSent && (
        <button onClick={sendOtp} style={styles.button}>Send OTP</button>
      )}

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />

          <button onClick={resetPassword} style={styles.button}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "350px",
    margin: "60px auto",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "#fff",
    textAlign: "center"
  },
  title: {
    marginBottom: "20px"
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #aaa"
  },
  button: {
    width: "95%",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#2196F3",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  }
};
