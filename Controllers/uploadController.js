const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadByLink = async (req, res) => {
  const { link } = req.body;
  try {
    const result = await cloudinary.uploader.upload(link);
    res.json(result);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

const upload = async (req, res) => {
  const uploadedFiles = [];
  try {
    for (let i = 0; i < req.files.length; i++) {
      const { path } = req.files[i];
      const result = await cloudinary.uploader.upload(path);
      uploadedFiles.push(result.secure_url);
    }
    res.json(uploadedFiles);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};

module.exports = { uploadByLink, upload };
