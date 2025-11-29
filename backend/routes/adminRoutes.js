const router = require("express").Router();
const { getAllUsers, getAllOwners } = require("../controllers/adminController");
const { verifyAdminToken } = require("../middleware/authMiddleware");

// Admin-only routes
router.get("/users", verifyAdminToken, getAllUsers);
router.get("/owners", verifyAdminToken, getAllOwners);

module.exports = router;
