const express = require("express");
const router = express.Router();
const {
  getStudyMaterialsBySubject,
  getAllStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getSubjectsWithCount,
} = require("../controllers/studyMaterialController");

// Simple admin auth middleware
const authenticateAdmin = (req, res, next) => {
  const adminAuth = req.header("Admin-Auth");
  if (adminAuth === "admin-authenticated") {
    req.admin = { username: "admin" };
    next();
  } else {
    res.status(401).json({ error: "Admin access required" });
  }
};

// Public routes (for students)
router.get("/subjects", getSubjectsWithCount);
router.get("/subject/:subject", getStudyMaterialsBySubject);

// Admin routes
router.get("/", authenticateAdmin, getAllStudyMaterials);
router.post("/", authenticateAdmin, createStudyMaterial);
router.put("/:id", authenticateAdmin, updateStudyMaterial);
router.delete("/:id", authenticateAdmin, deleteStudyMaterial);

module.exports = router;
