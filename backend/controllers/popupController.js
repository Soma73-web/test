const db = require('../models');
const Popup = db.Popup;
const redis = require("redis");
let redisClient;
(async () => {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect().catch(err => console.error('Redis connect error:', err));
})();

exports.getAllPopups = async (req, res) => {
  try {
    const cacheKey = 'popups:all';
    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }
    const popups = await Popup.findAll();
    if (redisClient && redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(popups), { EX: 300 });
    }
    res.json(popups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPopup = async (req, res) => {
  try {
    const { title, message, isActive } = req.body;
    const popup = await Popup.create({ title, message, isActive });
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('popups:all');
    }
    res.status(201).json(popup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, isActive } = req.body;
    const popup = await Popup.findByPk(id);
    if (!popup) return res.status(404).json({ error: 'Popup not found' });
    await popup.update({ title, message, isActive });
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('popups:all');
    }
    res.json(popup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findByPk(id);
    if (!popup) return res.status(404).json({ error: 'Popup not found' });
    await popup.destroy();
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('popups:all');
    }
    res.json({ message: 'Popup deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 