const path = require('path');
const { GalleryImage } = require('../models'); // ✅ Correct import from initialized models
const redis = require("redis");
let redisClient;
(async () => {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect().catch(err => console.error('Redis connect error:', err));
})();

// GET all gallery items
exports.getAllGalleryItems = async (_req, res) => {
  try {
    const cacheKey = 'gallery:all';
    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }
    const items = await GalleryImage.findAll({ attributes: ['id', 'title'] });
    if (redisClient && redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(items), { EX: 300 });
    }
    res.json(items);
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET single image inline
exports.getGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryImage.findByPk(id);

    if (!item) return res.status(404).send('Not found');

    res.setHeader('Content-Type', item.image_type);
    res.send(item.image);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET image as download
exports.downloadGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryImage.findByPk(id);

    if (!item) return res.status(404).send('Not found');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${item.title}${path.extname(item.image_type)}"`
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(item.image);
  } catch (err) {
    console.error('Error downloading image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    console.log('Gallery upload - req.file:', !!file);
    console.log('Gallery upload - req.files:', !!req.files);
    console.log('Gallery upload - req.body:', req.body);
    console.log('Gallery upload - file details:', file ? {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: !!file.buffer,
      bufferLength: file.buffer ? file.buffer.length : 0
    } : 'No file');

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Creating gallery item with:', {
      title,
      image: !!file.buffer,
      image_type: file.mimetype
    });

    await GalleryImage.create({
      title,
      image: file.buffer,
      image_type: file.mimetype
    });
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('gallery:all');
    }
    res.status(201).json({ message: 'Gallery item created successfully' });
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const file = req.file;

    const item = await GalleryImage.findByPk(id);
    if (!item) return res.status(404).send('Not found');

    item.title = title || item.title;
    if (file) {
      item.image = file.buffer;
      item.image_type = file.mimetype;
    }

    await item.save();
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('gallery:all');
    }
    res.json({ message: 'Gallery item updated successfully' });
  } catch (err) {
    console.error('Error updating gallery item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryImage.destroy({ where: { id } });

    if (!deleted) return res.status(404).send('Not found');

    res.json({ message: 'Gallery item deleted successfully' });
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('gallery:all');
    }
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
