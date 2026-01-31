const path = require('path');
const { Download } = require('../models'); // ✅ Import from initialized models

// GET all download items
exports.getAllDownloads = async (_req, res) => {
  try {
    const items = await Download.findAll({ attributes: ['id', 'title'] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching downloads:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET download file (force download)
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Download.findByPk(id);
    if (!item) return res.status(404).send('File not found');

    res.setHeader('Content-Disposition', `attachment; filename="${item.title}${item.file_type}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(item.file);
  } catch (err) {
    console.error('Error sending file:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST create new download item
exports.createDownload = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    console.log('Download upload - req.file:', !!file);
    console.log('Download upload - req.files:', !!req.files);
    console.log('Download upload - req.body:', req.body);
    console.log('Download upload - file details:', file ? {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: !!file.buffer
    } : 'No file');

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const file_type = path.extname(file.originalname).toLowerCase();

    await Download.create({
      title,
      file: file.buffer,
      file_type
    });

    res.status(201).json({ message: 'Download file created successfully' });
  } catch (err) {
    console.error('Error creating download:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT update existing download item
exports.updateDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const file = req.file;

    const item = await Download.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Download not found' });

    item.title = title || item.title;
    if (file) {
      item.file = file.buffer;
      item.file_type = path.extname(file.originalname).toLowerCase();
    }

    await item.save();
    res.json({ message: 'Download file updated successfully' });
  } catch (err) {
    console.error('Error updating download:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE download item
exports.deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Download.destroy({ where: { id } });

    if (!deleted) return res.status(404).send('Not found');

    res.json({ message: 'Download file deleted successfully' });
  } catch (err) {
    console.error('Error deleting download:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
