const express = require("express");
const router = express.Router();
const Stay = require("../models/Stay");
const multer = require("multer");
const path = require("path");
const { verifyOwnerToken } = require("../middleware/authMiddleware");

// -------------------- MULTER CONFIG --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter,
});

// -------------------- ADD STAY (Owner) --------------------
router.post("/add", verifyOwnerToken, upload.array("images", 5), async (req, res) => {
  try {
    const { title, address, rent, type, lat, lng } = req.body;

    if (!title || !address || !rent || !type || !lat || !lng)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: "At least one image is required" });

    const images = req.files.map(file => `/uploads/${file.filename}`); // store paths

    const stay = await Stay.create({
      title,
      address,
      rent,
      type,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      images,
      ownerId: req.user.id, // from JWT
      isApproved: false,    // pending admin approval
    });

    res.status(201).json({
      success: true,
      message: "Stay added successfully (Pending admin approval)",
      stay,
    });
  } catch (err) {
    console.error("Add Stay Error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});


// -------------------- GET OWNER STAYS --------------------
router.get("/owner", verifyOwnerToken, async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("Error fetching owner stays:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
