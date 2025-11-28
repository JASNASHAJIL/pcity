const Stay = require("../models/Stay");

// Add new stay
exports.addStay = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const { title, rent, type, address, lat, lng } = req.body;

    if (!req.files || !req.files.images) {
      return res.status(400).json({ success: false, message: "Images required" });
    }

    const images = [];
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    files.forEach((file) => {
      const filePath = `uploads/${Date.now()}_${file.name}`;
      file.mv(filePath);
      images.push(filePath);
    });

    const stay = await Stay.create({
      title,
      rent,
      type,
      address,
      lat,
      lng,
      ownerId,
      images,
    });

    res.json({ success: true, stay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all stays
exports.getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find();
    res.json({ success: true, stays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
