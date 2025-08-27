import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer
export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Single file upload middleware
export const uploadSingle = multerUpload.single('image');

// Multiple files upload middleware
export const uploadMultiple = multerUpload.array('images', 10);

// Profile picture upload middleware
export const uploadProfilePicture = multerUpload.single('profilePicture');

// Product images upload middleware
export const uploadProductImages = multerUpload.array('images', 5);
