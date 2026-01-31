const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics summary and trends
router.get('/summary', analyticsController.getSummary);
router.get('/trends', analyticsController.getTrends);

module.exports = router; 