const express = require('express');
const router = express.Router();
const popupController = require('../controllers/popupController');

router.get('/', popupController.getAllPopups);
router.post('/', popupController.createPopup);
router.put('/:id', popupController.updatePopup);
router.delete('/:id', popupController.deletePopup);

module.exports = router; 