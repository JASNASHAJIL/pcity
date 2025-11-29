const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==================== REGISTER ====================
exports.registerController = async (req, res) => {
  try {
    const { username, name, phone, password, role } = req.body;

    if (!username || !name || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ 
      $or: [{ username }, { phone }] 
    });

    if (existingUser)
      return res.status(400).json({ message: "Username or phone already exists" });

    const user = new User({ username, name, phone, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== LOGIN ====================
exports.loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== FORGOT PASSWORD / SEND OTP ====================
exports.forgotPasswordController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "Phone not registered" });

    const otp = generateOtp();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // --- Send OTP via Fast2SMS ---
    try {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          message: `Your OTP for StayEase is ${otp}`,
          route: "q",
          numbers: phone
        },
        {
          headers: {
            Authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      res.json({ success: true, message: "OTP sent to phone number" });
    } catch (smsError) {
      console.error("SMS Error:", smsError.response?.data || smsError.message);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

  } catch (err) {
    console.error("Forgot Password error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== VERIFY OTP & RESET PASSWORD ====================
exports.verifyOtpController = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // Reset password
    user.password = newPassword; // hashed by model
    user.resetOtp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
