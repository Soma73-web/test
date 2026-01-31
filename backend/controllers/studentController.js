const { Student, Attendance, TestResult } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');

// In-memory store for login attempts (use Redis in production)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

// Helper function to check and manage login attempts
const checkLoginAttempts = (studentId) => {
  const now = Date.now();
  const attempts = loginAttempts.get(studentId) || [];
  
  // Remove old attempts (older than lockout time)
  const recentAttempts = attempts.filter(time => now - time < LOCKOUT_TIME);
  
  if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
    return { blocked: true, remainingTime: Math.ceil((recentAttempts[0] + LOCKOUT_TIME - now) / 1000) };
  }
  
  return { blocked: false };
};

const recordLoginAttempt = (studentId) => {
  const attempts = loginAttempts.get(studentId) || [];
  attempts.push(Date.now());
  loginAttempts.set(studentId, attempts);
};

const clearLoginAttempts = (studentId) => {
  loginAttempts.delete(studentId);
};

// Student login with enhanced security
const loginStudent = async (req, res) => {
  try {
    let { studentId, password } = req.body;
    
    // Rate limiting check
    const attemptCheck = checkLoginAttempts(studentId);
    if (attemptCheck.blocked) {
      return res.status(429).json({ 
        error: `Too many login attempts. Please try again in ${attemptCheck.remainingTime} seconds.`,
        remainingTime: attemptCheck.remainingTime
      });
    }
    
    // Input validation and sanitization
    if (!studentId || !password) {
      recordLoginAttempt(studentId);
      return res.status(400).json({ error: 'Student ID and password are required' });
    }
    
    if (typeof studentId !== 'string' || typeof password !== 'string') {
      recordLoginAttempt(studentId);
      return res.status(400).json({ error: 'Invalid input type' });
    }
    
    // Sanitize inputs
    studentId = validator.trim(studentId);
    password = validator.trim(password);
    
    // Validate input length and format
    if (!validator.isLength(studentId, { min: 3, max: 20 })) {
      recordLoginAttempt(studentId);
      return res.status(400).json({ error: 'Student ID must be 3-20 characters' });
    }
    
    if (!validator.isLength(password, { min: 4, max: 64 })) {
      recordLoginAttempt(studentId);
      return res.status(400).json({ error: 'Password must be 4-64 characters' });
    }
    
    // Escape special characters to prevent injection
    studentId = validator.escape(studentId);

    const student = await Student.findOne({
      where: { studentId, isActive: true },
    });

    if (!student) {
      recordLoginAttempt(studentId);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      recordLoginAttempt(studentId);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Clear login attempts on successful login
    clearLoginAttempts(studentId);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    
    // Create JWT token with expiration
    const token = jwt.sign(
      { 
        id: student.id, 
        studentId: student.studentId,
        loginTime: new Date().toISOString()
      },
      jwtSecret,
      { expiresIn: "8h" }, // Shorter token expiration for security
    );

    // Log login activity (optional - for audit trail)
    console.log(`Student login: ${student.studentId} at ${new Date().toISOString()}`);

    res.json({
      message: "Login successful",
      token,
      expiresIn: 28800, // 8 hours in seconds
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        course: student.course,
        batch: student.batch,
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Student logout with session cleanup
const logoutStudent = async (req, res) => {
  try {
    // In a production setup with Redis/token blacklisting:
    // - Add token to blacklist
    // - Clear user session
    // - Log logout activity
    
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const studentId = req.student?.studentId;

    // Log logout activity (optional - for audit trail)
    if (studentId) {
      console.log(`Student logout: ${studentId} at ${new Date().toISOString()}`);
    }

    // Clear login attempts on logout
    if (studentId) {
      clearLoginAttempts(studentId);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

// Get student attendance
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    // Verify student owns this data
    if (req.student.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const whereClause = { studentId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      whereClause.date = {
        [require("sequelize").Op.between]: [startDate, endDate],
      };
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      order: [["date", "ASC"]],
    });

    res.json(attendance);
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

// Get student test results
const getStudentTestResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { testNumber } = req.query;

    // Verify student owns this data
    if (req.student.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const whereClause = { studentId };
    if (testNumber) {
      whereClause.testNumber = testNumber;
    }

    const testResults = await TestResult.findAll({
      where: whereClause,
      order: [["testDate", "DESC"]],
    });

    res.json(testResults);
  } catch (error) {
    console.error("Get test results error:", error);
    res.status(500).json({ error: "Failed to fetch test results" });
  }
};

// Get available test numbers for a student
const getAvailableTests = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify student owns this data
    if (req.student.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const tests = await TestResult.findAll({
      where: { studentId },
      attributes: ["testNumber", "testName"],
      group: ["testNumber", "testName"],
      order: [["testNumber", "ASC"]],
    });

    res.json(tests);
  } catch (error) {
    console.error("Get available tests error:", error);
    res.status(500).json({ error: "Failed to fetch available tests" });
  }
};

module.exports = {
  loginStudent,
  logoutStudent,
  getStudentAttendance,
  getStudentTestResults,
  getAvailableTests,
};
