// /config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const path = require("path");
require('dotenv').config({ path: __dirname + '/.env' });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
