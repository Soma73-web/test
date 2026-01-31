const jwt = require("jsonwebtoken");
const db = require("../models");
const Admin = db.Admin;

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.headers["admin-auth"];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists and is active
    const admin = await Admin.findOne({
      where: {
        id: decoded.id,
        isActive: true,
      },
    });

    if (!admin) {
      return res.status(401).json({ error: "Admin not found or inactive" });
    }

    // Check if session has expired (30 minutes of inactivity)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (admin.lastActivity < thirtyMinutesAgo) {
      return res
        .status(401)
        .json({ error: "Session expired due to inactivity" });
    }

    // Update last activity
    await admin.updateActivity();

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
