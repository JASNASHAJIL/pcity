const Stay = require("../models/Stay");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ---------------- MULTER CONFIG ----------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle multiple images upload
exports.uploadMiddleware = upload.array("images", 5);

// ---------------- ADD STAY (OWNER) ----------------
exports.addStay = async (req, res) => {
  console.log("AddStay Request Body:", req.body);
  console.log("Files:", req.files);

  try {
    const { title, type, rent, address, lat, lng } = req.body;
    const ownerId = req.user.id;

    if (!title || !type || !rent || !address || !lat || !lng)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: "At least 1 image is required" });

    // Upload each image to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "stays" },
              (error, result) => (error ? reject(error) : resolve(result.secure_url))
            );
            stream.end(file.buffer);
          })
      )
    );

    const stay = await Stay.create({
      title,
      type,
      rent: Number(rent),
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      images: imageUrls,
      ownerId,
      status: "pending",
      approvedAt: null,
    });

    res.status(201).json({
      success: true,
      message: "Stay added successfully (Pending Admin Approval)",
      stay,
    });
  } catch (err) {
    console.error("Add Stay Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


// ---------------- GET ALL APPROVED STAYS (USER) ----------------
exports.getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("Get All Stays Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- GET OWNER'S STAYS ----------------
exports.getOwnerStays = async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("Get Owner Stays Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- ADMIN → GET PENDING STAYS ----------------
exports.getPendingStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("Get Pending Stays Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- ADMIN → APPROVE STAY ----------------
exports.approveStay = async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });

    stay.status = "approved";
    stay.approvedAt = new Date();
    await stay.save();

    res.json({ success: true, message: "Stay approved successfully", stay });
  } catch (err) {
    console.error("Approve Stay Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- ADMIN → REJECT STAY ----------------
exports.rejectStay = async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });

    stay.status = "rejected";
    await stay.save();

    res.json({ success: true, message: "Stay rejected successfully", stay });
  } catch (err) {
    console.error("Reject Stay Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
