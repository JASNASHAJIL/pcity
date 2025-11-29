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

exports.uploadMiddleware = upload.array("images", 5);

// ---------------- ADD STAY (OWNER) ----------------
exports.addStay = async (req, res) => {
  try {
    const { title, type, rent, address, lat, lng } = req.body;
    const ownerId = req.user.id;

    // Validate required fields
    if (!title || !type || !rent || !address)
      return res.status(400).json({ message: "All fields are required" });

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }

    // Upload each image to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "stays" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      })
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
      isApproved: false,      // ⭐ MUST ADD - only admin can approve
      approvedAt: null,
    });

    res.json({
      success: true,
      message: "Stay added successfully (Pending Admin Approval)",
      stay,
    });
  } catch (err) {
    console.error("Add Stay Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------- GET OWNER'S STAYS ----------------
exports.getOwnerStays = async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("Get Owner Stays Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
