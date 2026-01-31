const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  markAttendance,
  addTestResult,
  updateTestResult,
} = require("../controllers/adminStudentController");

// Simple admin auth middleware (you can enhance this)
const authenticateAdmin = (req, res, next) => {
  // For now, just check if admin header is present
  // In production, implement proper admin JWT authentication
  const adminAuth = req.header("Admin-Auth");
  if (adminAuth === "admin-authenticated") {
    req.admin = { username: "admin" };
    next();
  } else {
    res.status(401).json({ error: "Admin access required" });
  }
};

// Student management routes
router.post("/students", authenticateAdmin, createStudent);
router.get("/students", authenticateAdmin, getAllStudents);
router.put("/students/:id", authenticateAdmin, updateStudent);
router.delete("/students/:id", authenticateAdmin, deleteStudent);

// Attendance management
router.post("/attendance", authenticateAdmin, markAttendance);

// Test results management
router.post("/test-results", authenticateAdmin, addTestResult);
router.put("/test-results/:id", authenticateAdmin, updateTestResult);

module.exports = router;
