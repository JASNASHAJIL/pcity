const Stay = require("../models/Stay");

// Add new stay (Owner)
exports.addStay = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { title, rent, type, address, lat, lng } = req.body;

    if (!req.files || !req.files.images) {
      return res
        .status(400)
        .json({ success: false, message: "Images required" });
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
      isApproved: false, // 🚨 NOT APPROVED UNTIL ADMIN APPROVES
    });

    res.json({
      success: true,
      message: "Stay added. Pending admin approval.",
      stay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all APPROVED stays (Users)
exports.getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find({ isApproved: true }); // 👍 Only approved stays
    res.json({ success: true, stays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN → Get all pending stays
exports.getPendingStays = async (req, res) => {
  try {
    const stays = await Stay.find({ isApproved: false });
    res.json({ success: true, stays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN → Approve a stay
exports.approveStay = async (req, res) => {
  try {
    const stayId = req.params.id;

    const stay = await Stay.findById(stayId);
    if (!stay) {
      return res
        .status(404)
        .json({ success: false, message: "Stay not found" });
    }

    stay.isApproved = true;
    await stay.save();

    res.json({
      success: true,
      message: "Stay approved successfully",
      stay,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
