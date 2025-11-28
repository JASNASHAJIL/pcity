require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const ownerRoutes = require("./routes/ownerRoutes");
const StayRoutes = require("./routes/stayRoutes")
const fileUpload = require("express-fileupload");


const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload()); 

// Serve uploaded images folder
app.use("/uploads", express.static("uploads"));

// All owner APIs
app.use("/api/owner", ownerRoutes);
app.use("/api",authRoutes)
app.use("/api/stay", StayRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
