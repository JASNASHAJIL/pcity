const jwt = require("jsonwebtoken");

exports.verifyOwnerToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received:", token);

  if (!token)
    return res.status(401).json({ success: false, message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verify error:", err);
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    console.log("Decoded JWT:", user);

    if (user.role !== "owner") {
      console.log("Role mismatch:", user.role);
      return res.status(403).json({ success: false, message: "Owner access only" });
    }

    req.user = user;
    next();
  });
};
