require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const stayRoutes = require("./routes/stayRoutes");
const adminRoutes = require("./routes/adminRoutes");

const createDefaultAdmin = require("./CreateAdmin");

const app = express();

// -------------------- MIDDLEWARES --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// -------------------- ROUTES --------------------
app.use("/api", authRoutes);          // login / register
app.use("/api/owner", ownerRoutes);   // owner routes
app.use("/api/stay", stayRoutes);     // stays + admin approval
app.use("/api/admin", adminRoutes);   // admin panel

// -------------------- DATABASE & DEFAULT ADMIN --------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Create default admin if not exists
    await createDefaultAdmin();

    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // exit process if DB connection fails
  }
};

startServer();
