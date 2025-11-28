const express = require("express");
const router = express.Router();
const Stay = require("../models/Stay");
const multer = require("multer");
const path = require("path");

// -------------------- MULTER STORAGE --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where images are saved
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// -------------------- FILE FILTER (only images) --------------------
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter,
});

// -------------------- ADD STAY --------------------
router.post("/addStay", upload.array("images", 5), async (req, res) => {
  try {
    const { title, address, rent, type, lat, lng, ownerId } = req.body;

    // Validate required fields
    if (!title || !address || !rent || !type || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Create image URLs
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    // Save data to MongoDB
    const stay = await Stay.create({
      title,
      address,
      rent,
      type,
      lat,
      lng,
      images,
      ownerId: ownerId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Stay added successfully",
      stay,
    });
  } catch (err) {
    console.error("Add Stay Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});

// -------------------- GET ALL STAYS --------------------
router.get("/getStays", async (req, res) => {
  try {
    const stays = await Stay.find();
    return res.json({
      success: true,
      stays,
    });
  } catch (err) {
    console.error("Error fetching stays:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
