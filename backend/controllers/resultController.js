const { Result } = require('../models'); // ✅ Correct import from initialized models

// Get all results (excluding image blob)
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.findAll({
      attributes: ['id', 'name', 'college', 'rank', 'year']
    });
    res.json(results);
  } catch (err) {
    console.error('Failed to fetch results:', err);
    res.status(500).json({ error: 'Server error while fetching results' });
  }
};

// Get image by ID
exports.getResultImage = async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);
    if (!result || !result.image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', result.image_type || 'image/jpeg');
    res.send(result.image);
  } catch (err) {
    console.error('Error fetching result image:', err);
    res.status(500).json({ error: 'Failed to fetch result image' });
  }
};

// Create new result
exports.createResult = async (req, res) => {
  try {
    const { name, college, rank, year } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const result = await Result.create({
      name,
      college,
      rank,
      year,
      image: req.file.buffer,
      image_type: req.file.mimetype || 'image/jpeg'
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating result:', err);
    res.status(500).json({ error: 'Failed to create result' });
  }
};

// Update result
exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    const { name, college, rank, year } = req.body;

    result.name = name;
    result.college = college;
    result.rank = rank;
    result.year = year;

    if (req.file) {
      result.image = req.file.buffer;
      result.image_type = req.file.mimetype || 'image/jpeg';
    }

    await result.save();
    res.json({ message: 'Result updated successfully' });
  } catch (err) {
    console.error('Error updating result:', err);
    res.status(500).json({ error: 'Failed to update result' });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    await result.destroy();
    res.json({ message: 'Result deleted successfully' });
  } catch (err) {
    console.error('Error deleting result:', err);
    res.status(500).json({ error: 'Failed to delete result' });
  }
};
