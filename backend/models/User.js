const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // login username
  name: { type: String, required: true },                  // full name
  phone: { type: String, required: true, unique: true },   // mobile number
  password: { type: String, required: true },              // hashed password
  role: { type: String, enum: ["user", "owner"], default: "user" },
  resetOtp: { type: String },
otpExpiry: { type: Date },
                             // OTP expiry time
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", userSchema);

