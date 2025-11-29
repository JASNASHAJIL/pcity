const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  forgotPasswordController,
  verifyOtpController
} = require("../controllers/authController");

// ---------------- USER AUTH ----------------
router.post("/register", registerController);       // Signup (User / Owner)
router.post("/login", loginController);             // Login
router.post("/forgot-password", forgotPasswordController); // Send OTP
router.post("/verify-otp", verifyOtpController);   // Verify OTP & reset password

module.exports = router;
