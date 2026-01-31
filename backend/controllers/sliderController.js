const { Slider } = require('../models');

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const newSlider = await Slider.create({
      photo: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({ id: newSlider.id, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Get all slider images
exports.getAllImageIds = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      attributes: ['id'],
      order: [['id', 'ASC']],
    });
    res.json(sliders);
  } catch (error) {
    console.error('Fetch slider images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Get slider image by ID
exports.getImageById = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', slider.mimeType);
    res.send(slider.photo);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

// Delete slider image by ID
exports.deleteImageById = async (req, res) => {
  try {
    const deleted = await Slider.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// Debug endpoint to check slider data
exports.debugSliderData = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      attributes: ['id'],
      order: [['id', 'ASC']],
    });
    
    console.log('Debug: Found sliders:', sliders);
    
    res.json({
      count: sliders.length,
      sliders: sliders,
      message: `Found ${sliders.length} slider images`
    });
  } catch (error) {
    console.error('Debug slider error:', error);
    res.status(500).json({ error: 'Failed to debug slider data' });
  }
};
