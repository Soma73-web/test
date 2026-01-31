const { Student, Attendance, TestResult } = require("../models");
const bcrypt = require("bcryptjs");
const validator = require('validator');

// Create student account
const createStudent = async (req, res) => {
  try {
    let {
      studentId,
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      course,
      batch,
    } = req.body;

    // Input validation
    if (!studentId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Sanitize inputs
    studentId = validator.trim(studentId);
    firstName = validator.trim(firstName);
    lastName = validator.trim(lastName);
    email = validator.trim(email).toLowerCase();
    phone = phone ? validator.trim(phone) : '';
    course = course ? validator.trim(course) : '';
    batch = batch ? validator.trim(batch) : '';

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Validate names (allow letters, spaces, and common characters)
    if (!validator.isLength(firstName, { min: 2, max: 50 }) || 
        !validator.isLength(lastName, { min: 2, max: 50 })) {
      return res.status(400).json({ error: "Names must be 2-50 characters long" });
    }

    // Validate student ID (allow alphanumeric and common characters)
    if (!validator.isLength(studentId, { min: 3, max: 20 })) {
      return res.status(400).json({ error: "Student ID must be 3-20 characters long" });
    }

    // Validate phone number if provided (more flexible)
    if (phone && phone.length < 10) {
      return res.status(400).json({ error: "Phone number must be at least 10 digits" });
    }

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ where: { studentId } });
    if (existingStudent) {
      return res.status(400).json({ error: "Student ID already exists" });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      course,
      batch,
    });

    res.status(201).json({
      message: "Student created successfully",
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
    console.error("Create student error:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ["password"] },
      order: [["firstName", "ASC"]],
    });

    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await Student.update(updateData, { where: { id } });

    const updatedStudent = await Student.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, reason } = req.body;
    const markedBy = req.admin?.username || "admin";

    const attendance = await Attendance.findOne({
      where: { studentId, date },
    });

    if (attendance) {
      await attendance.update({ status, reason, markedBy });
      res.json({ message: "Attendance updated successfully", attendance });
    } else {
      const newAttendance = await Attendance.create({
        studentId,
        date,
        status,
        reason,
        markedBy,
      });
      res
        .status(201)
        .json({
          message: "Attendance marked successfully",
          attendance: newAttendance,
        });
    }
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

// Add test result
const addTestResult = async (req, res) => {
  try {
    const {
      studentId,
      testNumber,
      testName,
      subject,
      maxMarks,
      obtainedMarks,
      testDate,
      remarks,
    } = req.body;

    const addedBy = req.admin?.username || "admin";
    const percentage = ((obtainedMarks / maxMarks) * 100).toFixed(2);

    // Calculate grade
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    const testResult = await TestResult.create({
      studentId,
      testNumber,
      testName,
      subject,
      maxMarks,
      obtainedMarks,
      percentage,
      grade,
      testDate,
      remarks,
      addedBy,
    });

    res.status(201).json({
      message: "Test result added successfully",
      testResult,
    });
  } catch (error) {
    console.error("Add test result error:", error);
    res.status(500).json({ error: "Failed to add test result" });
  }
};

// Update test result
const updateTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { obtainedMarks, maxMarks, remarks } = req.body;

    const percentage = ((obtainedMarks / maxMarks) * 100).toFixed(2);

    // Calculate grade
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    await TestResult.update(
      {
        obtainedMarks,
        maxMarks,
        percentage,
        grade,
        remarks,
      },
      { where: { id } },
    );

    const updatedResult = await TestResult.findByPk(id);

    res.json({
      message: "Test result updated successfully",
      testResult: updatedResult,
    });
  } catch (error) {
    console.error("Update test result error:", error);
    res.status(500).json({ error: "Failed to update test result" });
  }
};

// Delete student permanently
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete related data first (cascade delete)
    await Attendance.destroy({ where: { studentId: id } });
    await TestResult.destroy({ where: { studentId: id } });
    
    // Delete the student
    await Student.destroy({ where: { id } });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  markAttendance,
  addTestResult,
  updateTestResult,
};
