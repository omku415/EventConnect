const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'auto', 
  },
});

const uploadResume = multer({ storage: resumeStorage });

module.exports = uploadResume;
