// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { updateProfile, getProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload, updateProfile);

// Matches route
router.get('/matches', auth, async (req, res) => {
    try {
        console.log('Matches route hit for user:', req.user.id);
        
        // Check if user exists
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            console.log('Current user not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Log current user's interests
        console.log('Current user interests:', currentUser.interests);

        // Find matches only if user has interests
        if (!currentUser.interests || currentUser.interests.length === 0) {
            console.log('User has no interests set');
            return res.json([]); // Return empty array if no interests
        }

        // Find matches
        const matches = await User.find({
            _id: { $ne: req.user.id }, // Exclude current user
            interests: { $in: currentUser.interests } // Match any shared interests
        }).select('username age profilePicture');

        console.log('Found matches:', matches.length);
        res.json(matches);

    } catch (error) {
        console.error('Error in /matches route:', error);
        res.status(500).json({ 
            message: 'Error fetching matches',
            error: error.message 
        });
    }
});

module.exports = router;
