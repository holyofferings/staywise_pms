const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subdirectory based on file type
    let subDir = 'misc';
    
    if (file.fieldname === 'roomImages') {
      subDir = 'rooms';
    } else if (file.fieldname === 'logo') {
      subDir = 'hotels';
    } else if (file.fieldname === 'profileImage') {
      subDir = 'users';
    } else if (file.fieldname === 'identityProof') {
      subDir = 'id_proofs';
    }
    
    const destPath = path.join(uploadsDir, subDir);
    
    // Create subdirectory if it doesn't exist
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(ext);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, .gif, and .pdf files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Export various upload configurations
module.exports = {
  // Single file uploads
  uploadSingle: (fieldName) => upload.single(fieldName),
  
  // Multiple file uploads for same field
  uploadMultiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  
  // Multiple fields with different file counts
  uploadFields: (fields) => upload.fields(fields),
  
  // Room images upload
  uploadRoomImages: upload.array('roomImages', 10),
  
  // Hotel logo upload
  uploadHotelLogo: upload.single('logo'),
  
  // User profile image upload
  uploadProfileImage: upload.single('profileImage'),
  
  // Identity proof upload
  uploadIdentityProof: upload.single('identityProof'),
  
  // Error handler
  handleMulterError
}; 