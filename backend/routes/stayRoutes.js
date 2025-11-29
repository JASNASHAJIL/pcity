const express = require("express");
const router = express.Router();

const {
  addStay,
  uploadMiddleware,
  getAllStays,
  getPendingStays,
  approveStay,
  rejectStay,
  getOwnerStays,
} = require("../controllers/stayController");

const { verifyOwnerToken, verifyAdminToken } = require("../middleware/authMiddleware");

// OWNER ROUTES
router.post("/add", verifyOwnerToken, uploadMiddleware, addStay);
router.get("/owner", verifyOwnerToken, getOwnerStays);

// USER ROUTES
router.get("/all", getAllStays);

// ADMIN ROUTES
router.get("/pending", verifyAdminToken, getPendingStays);
router.put("/approve/:id", verifyAdminToken, approveStay);
router.put("/reject/:id", verifyAdminToken, rejectStay);

module.exports = router;
