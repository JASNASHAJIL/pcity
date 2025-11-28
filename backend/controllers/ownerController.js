const Stay = require("../models/Stay");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadMiddleware = upload.array("images", 5);

exports.addStay = async (req, res) => {
  try {
    const { title, type, rent, address, lat, lng } = req.body;
    const ownerId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    // Upload each image to Cloudinary
    const images = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "stays" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      })
    );

    const stay = await Stay.create({
      title,
      type,
      rent,
      address,
      lat,
      lng,
      images,
      ownerId,
    });

    res.json({ message: "Stay added", stay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOwnerStays = async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id });
    res.json(stays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
