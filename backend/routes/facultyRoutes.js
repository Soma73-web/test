const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/faculty directory exists
const uploadDir = path.join(__dirname, '../uploads/faculty');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use the same upload middleware with proper file filtering
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Allow images for faculty uploads
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (!allowedImageTypes.test(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFacultyById);
router.get('/:id/image', facultyController.getFacultyImage);
router.get('/:id/photo', facultyController.getFacultyImage);
router.post('/', upload.single('photo'), facultyController.createFaculty);
router.put('/:id', upload.single('photo'), facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router; 