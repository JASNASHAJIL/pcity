const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  role: { type: String, default: "owner" },
});

module.exports = mongoose.model("Owner", ownerSchema);
