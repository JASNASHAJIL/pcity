// utils/otpService.js
// utils/otpService.js
// This function sends OTP via SMS (console log for demo, can integrate real SMS service)
exports.sendOTPToPhone = async (phone, otp) => {
  console.log(`Sending OTP ${otp} to phone ${phone}`);
  // TODO: integrate SMS provider like Twilio, MSG91, etc.
};
