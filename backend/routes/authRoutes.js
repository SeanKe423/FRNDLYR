// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { updateProfile, getProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload, updateProfile);

module.exports = router;
