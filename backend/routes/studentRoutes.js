const express = require("express");
const router = express.Router();
const {
  loginStudent,
  logoutStudent,
  getStudentAttendance,
  getStudentTestResults,
  getAvailableTests,
} = require("../controllers/studentController");

// Student authentication middleware
const authenticateStudent = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const jwt = require("jsonwebtoken");
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    const decoded = jwt.verify(
      token,
      jwtSecret,
    );
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Public routes
router.post("/login", loginStudent);

// Student logout endpoint with authentication
router.post("/logout", authenticateStudent, logoutStudent);

// Protected routes
router.get("/:studentId/attendance", authenticateStudent, getStudentAttendance);
router.get(
  "/:studentId/test-results",
  authenticateStudent,
  getStudentTestResults,
);
router.get(
  "/:studentId/available-tests",
  authenticateStudent,
  getAvailableTests,
);

module.exports = router;
