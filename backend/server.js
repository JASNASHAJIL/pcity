require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const StayRoutes = require("./routes/stayRoutes");
const adminRoutes = require("./routes/adminRoutes");

const createDefaultAdmin = require("./CreateAdmin");

// Create default admin once
createDefaultAdmin();

const app = express();

// -------------------- MIDDLEWARES --------------------
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Serve images
app.use("/uploads", express.static("uploads"));

// -------------------- ROUTES --------------------
app.use("/api/admin", adminRoutes);   // Put after middlewares
app.use("/api/owner", ownerRoutes);
app.use("/api", authRoutes);          // /login /register etc.
app.use("/api/stay", StayRoutes);

// -------------------- DATABASE --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// -------------------- START SERVER --------------------
app.listen(5000, () => console.log("Server running on port 5000"));
