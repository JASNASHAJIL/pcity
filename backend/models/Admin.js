const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  role: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", adminSchema);
