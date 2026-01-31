const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/upload');
const ctrl    = require('../controllers/galleryController');

router.get('/',                ctrl.getAllGalleryItems);
router.get('/image/:id',       ctrl.getGalleryImage);        // inline <img src=…>
router.get('/download/:id',    ctrl.downloadGalleryImage);   // attachment
router.post('/',               upload.single('image'), ctrl.createGalleryItem);
router.put('/:id',             upload.single('image'), ctrl.updateGalleryItem);
router.delete('/:id',          ctrl.deleteGalleryItem);

module.exports = router;
