const express = require('express');
const multer = require('multer');
const router = express.Router();
const resultController = require('../controllers/resultController');

// Store uploaded files in memory (as Buffer) with proper filtering
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Allow images for result uploads
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (!allowedImageTypes.test(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Routes
router.get('/', resultController.getAllResults);

// ✅ FIXED: RESTful and matches frontend: /api/results/:id/image
router.get('/:id/image', resultController.getResultImage);

router.post('/', upload.single('image'), resultController.createResult);
router.put('/:id', upload.single('image'), resultController.updateResult);
router.delete('/:id', resultController.deleteResult);

module.exports = router;
