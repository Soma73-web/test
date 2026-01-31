const express  = require('express');
const router   = express.Router();
const upload   = require('../middleware/upload');
const ctrl     = require('../controllers/downloadController');

router.get('/',          ctrl.getAllDownloads);
router.get('/file/:id',  ctrl.downloadFile);              // stream / download
router.post('/',         upload.single('file'), ctrl.createDownload);
router.put('/:id',       upload.single('file'), ctrl.updateDownload);
router.delete('/:id',    ctrl.deleteDownload);
// Download file by ID
router.get('/:id/download', ctrl.downloadFile);

module.exports = router;
