const db = require('../models');
const Lead = db.Lead;
const LeadPopupConfig = db.sequelize.LeadPopupConfig;
const validator = require('validator');

// POST /api/leads - Create a new lead
exports.createLead = async (req, res) => {
  try {
    // Check if popup is enabled
    const config = await LeadPopupConfig.findOne({ where: { id: 1 } });
    if (config && config.enabled === false) {
      return res.status(403).json({ error: 'Lead popup is currently disabled.' });
    }
    
    let { name, phone } = req.body;
    
    // Input validation and sanitization
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }
    
    // Sanitize inputs
    name = validator.trim(name);
    phone = validator.trim(phone);
    
    // Validate name (alphanumeric and spaces only, 2-50 chars)
    if (!validator.isLength(name, { min: 2, max: 50 }) || 
        !validator.matches(name, /^[a-zA-Z\s]+$/)) {
      return res.status(400).json({ error: 'Name must be 2-50 characters with letters and spaces only.' });
    }
    
    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
    }
    
    const lead = await Lead.create({ name, phone });
    res.status(201).json({ message: 'Lead submitted successfully', lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Server error while creating lead.' });
  }
};

// GET /api/leads - List all leads (admin only)
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Server error while fetching leads.' });
  }
};

// GET /api/leads/popup-config - Get popup enabled/disabled state
exports.getPopupConfig = async (req, res) => {
  try {
    let config = await LeadPopupConfig.findOne({ where: { id: 1 } });
    if (!config) {
      config = await LeadPopupConfig.create({ id: 1, enabled: true });
    }
    res.json({ enabled: config.enabled });
  } catch (error) {
    console.error('Error fetching popup config:', error);
    res.status(500).json({ error: 'Server error while fetching popup config.' });
  }
};

// POST /api/leads/popup-config - Set popup enabled/disabled state (admin only)
exports.setPopupConfig = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    // Validate input
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'Enabled must be a boolean value.' });
    }
    
    let config = await LeadPopupConfig.findOne({ where: { id: 1 } });
    if (!config) {
      config = await LeadPopupConfig.create({ id: 1, enabled });
    } else {
      config.enabled = enabled;
      await config.save();
    }
    res.json({ enabled: config.enabled });
  } catch (error) {
    console.error('Error setting popup config:', error);
    res.status(500).json({ error: 'Server error while setting popup config.' });
  }
}; 