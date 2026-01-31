const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: Submit a new lead
router.post('/', leadController.createLead);

// Admin: Get all leads
router.get('/', authMiddleware, leadController.getLeads);

// Public: Get popup enabled/disabled state
router.get('/popup-config', leadController.getPopupConfig);

// Admin: Set popup enabled/disabled state
router.post('/popup-config', authMiddleware, leadController.setPopupConfig);

module.exports = router; 