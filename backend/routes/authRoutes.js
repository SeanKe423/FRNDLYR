// backend/routes/authRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/authController');
const { updateProfile } = require('../controllers/profileController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', updateProfile); // New route for updating profile

module.exports = router;
