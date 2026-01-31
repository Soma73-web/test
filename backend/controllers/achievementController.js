const db = require('../models');
const Achievement = db.Achievement;
const path = require('path');

// Get all achievements
exports.getAll = async (req, res) => {
  try {
    const achievements = await Achievement.findAll({ order: [['createdAt', 'DESC']] });
    const mapped = achievements.map(a => {
      const obj = a.toJSON();
      obj.imageUrl = `${req.protocol}://${req.get('host')}/api/achievements/${a.id}/image`;
      obj.image = obj.imageUrl; // legacy key
      delete obj.image_data;
      delete obj.image_type;
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

// Get achievement by ID
exports.getById = async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    const obj = achievement.toJSON();
    obj.imageUrl = `${req.protocol}://${req.get('host')}/api/achievements/${achievement.id}/image`;
    obj.image = obj.imageUrl;
    delete obj.image_data;
    delete obj.image_type;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievement' });
  }
};

// Create achievement
exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    let image_data = null;
    let image_type = null;
    if (req.file) {
      image_data = req.file.buffer;
      image_type = req.file.mimetype;
    }
    // Input validation
    if (!image_data) {
      return res.status(400).json({ error: "Image is required" });
    }
    const achievement = await Achievement.create({ title, description, image_data, image_type });
    const created = achievement.toJSON();
    created.imageUrl = `${req.protocol}://${req.get('host')}/api/achievements/${achievement.id}/image`;
    created.image = created.imageUrl;
    delete created.image_data;
    delete created.image_type;
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create achievement' });
  }
};

// Update achievement
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    let image_data = achievement.image_data;
    let image_type = achievement.image_type;
    if (req.file) {
      image_data = req.file.buffer;
      image_type = req.file.mimetype;
    }
    await achievement.update({ title, description, image_data, image_type });
    const updated = achievement.toJSON();
    updated.imageUrl = `${req.protocol}://${req.get('host')}/api/achievements/${achievement.id}/image`;
    updated.image = updated.imageUrl;
    delete updated.image_data;
    delete updated.image_type;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update achievement' });
  }
};

// Stream achievement image
exports.getImage = async (req, res) => {
  try {
    const ach = await Achievement.findByPk(req.params.id);
    if (!ach || !ach.image_data) return res.status(404).json({ error: 'Image not found' });
    res.set('Content-Type', ach.image_type || 'image/jpeg');
    res.send(ach.image_data);
  } catch (err) {
    console.error('Error serving achievement image:', err);
    res.status(500).json({ error: 'Server error serving image' });
  }
};

// Delete achievement
exports.delete = async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    await achievement.destroy();
    res.json({ message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
}; 