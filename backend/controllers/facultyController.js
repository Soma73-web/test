const db = require('../models');
const Faculty = db.Faculty;
const path = require('path');

// Get all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findAll({ order: [['createdAt', 'DESC']] });
    const mapped = faculty.map(f => {
      const obj = f.toJSON();
      obj.imageUrl = `${req.protocol}://${req.get('host')}/api/faculty/${f.id}/image`;
      obj.photo = obj.imageUrl;
      delete obj.image_data;
      delete obj.image_type;
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
};

// Get faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    const obj = faculty.toJSON();
    obj.imageUrl = `${req.protocol}://${req.get('host')}/api/faculty/${faculty.id}/image`;
    obj.photo = obj.imageUrl;
    delete obj.image_data;
    delete obj.image_type;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
};

// Create faculty
exports.createFaculty = async (req, res) => {
  try {
    const { name, subject, education } = req.body;
    
    console.log('Faculty upload - req.file:', !!req.file);
    console.log('Faculty upload - req.files:', !!req.files);
    console.log('Faculty upload - req.body:', req.body);
    
    // Input validation
    if (!name || !subject) {
      return res.status(400).json({ error: "Name and subject are required" });
    }
    
    let image_data = null;
    let image_type = null;
    const fileObj = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    if (fileObj) {
      image_data = fileObj.buffer;
      image_type = fileObj.mimetype;
    }
    
    const faculty = await Faculty.create({ name, subject, education: education || '', image_data, image_type });
    const obj = faculty.toJSON();
    obj.imageUrl = `${req.protocol}://${req.get('host')}/api/faculty/${faculty.id}/image`;
    obj.photo = obj.imageUrl;
    delete obj.image_data;
    delete obj.image_type;
    res.status(201).json(obj);
  } catch (err) {
    console.error('Faculty creation error:', err);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { name, subject, education } = req.body;
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    let image_data = faculty.image_data;
    let image_type = faculty.image_type;
    const fileObj = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    if (fileObj) {
      image_data = fileObj.buffer;
      image_type = fileObj.mimetype;
    }
    await faculty.update({ name, subject, education, image_data, image_type });
    const obj = faculty.toJSON();
    obj.imageUrl = `${req.protocol}://${req.get('host')}/api/faculty/${faculty.id}/image`;
    obj.photo = obj.imageUrl;
    delete obj.image_data;
    delete obj.image_type;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update faculty' });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    await faculty.destroy();
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
};

// Stream faculty image
exports.getFacultyImage = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty || !faculty.image_data) return res.status(404).json({ error: 'Image not found' });
    res.set('Content-Type', faculty.image_type || 'image/jpeg');
    res.send(faculty.image_data);
  } catch (err) {
    console.error('Error serving faculty image:', err);
    res.status(500).json({ error: 'Server error serving image' });
  }
}; 