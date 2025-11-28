const router = require("express").Router();
const { getAllUsers, getAllOwners } = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/users", verifyToken("admin"), getAllUsers);
router.get("/owners", verifyToken("admin"), getAllOwners);

module.exports = router;
