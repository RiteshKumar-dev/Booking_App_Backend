const express = require('express');
const router = express.Router();
const uploadController = require('../Controllers/uploadController');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const photosMiddleware = multer({ dest: 'uploads/' });

router.route('/upload-by-link').post(uploadController.uploadByLink);
router.route('/upload').post(photosMiddleware.array('photos', 100), uploadController.upload);

module.exports = router;
