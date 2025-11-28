const express = require("express");
const router = express.Router();
const { addStay, getAllStays } = require("../controllers/stayController");
const { verifyOwnerToken } = require("../middleware/authMiddleware");

// Add new Stay
router.post("/add", verifyOwnerToken, addStay);

// Get all stays
router.get("/all", getAllStays);

module.exports = router;
