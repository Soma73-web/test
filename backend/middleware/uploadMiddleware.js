const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure storage with secure filename generation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate secure random filename to prevent path traversal
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});

// Enhanced file filter with stricter validation
const fileFilter = (req, file, cb) => {
  // Check file mimetype
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  // Check file extension
  const allowedExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;
  
  // Validate both mimetype and extension
  if (!allowedMimeTypes.includes(file.mimetype) || 
      !allowedExtensions.test(file.originalname)) {
    return cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'), false);
  }
  
  // Check for suspicious file names (path traversal attempts)
  if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
    return cb(new Error('Invalid filename detected!'), false);
  }
  
  cb(null, true);
};

// Enhanced multer configuration with security limits
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1, // Only 1 file at a time
    fieldSize: 1024 * 1024 // 1MB for text fields
  }
});

// Middleware to handle upload errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Only 1 file allowed.' });
    }
    return res.status(400).json({ error: 'File upload error.' });
  }
  
  if (error.message) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
};

module.exports = { upload, handleUploadError };