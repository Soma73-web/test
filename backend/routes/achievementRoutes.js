const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/achievements directory exists
const uploadDir = path.join(__dirname, '../uploads/achievements');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Allow images for achievement uploads
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (!allowedImageTypes.test(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.get('/', achievementController.getAll);
router.get('/:id', achievementController.getById);
router.get('/:id/image', achievementController.getImage);
router.post('/', upload.single('image'), achievementController.create);
router.put('/:id', upload.single('image'), achievementController.update);
router.delete('/:id', achievementController.delete);

module.exports = router; 