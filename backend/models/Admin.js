const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: { type: String, required: true, unique: true },

    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, default: "admin" }
  },
  { timestamps: true }
);

// --------- HASH PASSWORD BEFORE SAVE ---------
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --------- COMPARE PASSWORD ---------
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
