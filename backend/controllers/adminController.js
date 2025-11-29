const User = require("../models/User");
const Owner = require("../models/Owner");
const Stay = require("../models/Stay");

// -------------------- GET ALL USERS --------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// -------------------- GET ALL OWNERS --------------------
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      owners,
    });
  } catch (err) {
    console.error("Get All Owners Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// -------------------- APPROVE STAY --------------------
exports.approveStay = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate stay ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, message: "Invalid stay ID" });
    }

    const stay = await Stay.findById(id);
    if (!stay) {
      return res.status(404).json({ success: false, message: "Stay not found" });
    }

    if (stay.isApproved) {
      return res.status(400).json({ success: false, message: "Stay already approved" });
    }

    stay.isApproved = true;
    stay.approvedAt = new Date();
    await stay.save();

    res.json({
      success: true,
      message: "Stay approved successfully",
      stay,
    });
  } catch (err) {
    console.error("Approve Stay Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- REJECT STAY --------------------
exports.rejectStay = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, message: "Invalid stay ID" });
    }

    const stay = await Stay.findById(id);
    if (!stay) {
      return res.status(404).json({ success: false, message: "Stay not found" });
    }

    stay.isApproved = false;
    stay.rejectedAt = new Date();
    await stay.save();

    res.json({
      success: true,
      message: "Stay rejected successfully",
      stay,
    });
  } catch (err) {
    console.error("Reject Stay Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
