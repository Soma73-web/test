const express = require('express');
const router = express.Router();
const multer = require('multer');
const sliderController = require('../controllers/sliderController');

// Configure multer with proper file filtering
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Allow images for slider uploads
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (!allowedImageTypes.test(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Routes using controller
router.post('/', upload.single('photo'), sliderController.uploadImage);
router.get('/', sliderController.getAllImageIds);
router.get('/image/:id', sliderController.getImageById);
router.delete('/:id', sliderController.deleteImageById);
router.get('/debug', sliderController.debugSliderData);

module.exports = router;
