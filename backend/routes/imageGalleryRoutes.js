const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getCategoriesWithImages,
  uploadImage,
  deleteImage,
  getImageById,
} = require('../controllers/imageGalleryController');
const db = require('../models');

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all categories with their images
router.get('/', getCategoriesWithImages);

// GET /api/image-gallery/categorized
router.get('/categorized', async (req, res) => {
  try {
    const categories = await db.GalleryCategory.findAll({
      include: [{ model: db.CategorizedGalleryImage }]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET image by id
router.get('/image/:id', getImageById);

// POST upload image to category
router.post('/upload', upload.single('image'), uploadImage);

// DELETE image by id
router.delete('/image/:id', deleteImage);

module.exports = router;
