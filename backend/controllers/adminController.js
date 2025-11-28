const Stay = require("../models/Stay");
const User = require("../models/User");
const Owner = require("../models/Owner");

exports.approveStay = async (req, res) => {
  try {
    const { id } = req.params;

    const stay = await Stay.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!stay)
      return res.status(404).json({ success: false, message: "Stay not found" });

    res.json({ success: true, message: "Stay approved", stay });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
