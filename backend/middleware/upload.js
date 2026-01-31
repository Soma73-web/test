const multer = require('multer');
const path = require('path');

// Memory storage for BLOB upload
const storage = multer.memoryStorage();

// File filter for different upload types
const fileFilter = (req, file, cb) => {
  // Check if this is a download upload (based on route)
  const isDownloadUpload = req.originalUrl.includes('/downloads') || req.originalUrl.includes('/study-materials');
  
  console.log('Upload route:', req.originalUrl, 'isDownload:', isDownloadUpload);
  
  if (isDownloadUpload) {
    // Allow PDF, DOC, DOCX, PPT, PPTX for downloads
    const allowedDownloadTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    console.log('File extension:', ext, 'Allowed:', allowedDownloadTypes.test(ext));
    if (!allowedDownloadTypes.test(ext)) {
      return cb(new Error('Only document files (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT) are allowed for downloads!'), false);
    }
  } else {
    // Allow images for other uploads
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (!allowedImageTypes.test(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
  }
  
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB for documents
});

module.exports = upload;
