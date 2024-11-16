// backend/controllers/profileController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.updateProfile = async (req, res) => {
    try {
        const { bio, location, age } = req.body;
        const interests = JSON.parse(req.body.interests);
        
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bio = bio || user.bio;
        user.interests = interests || user.interests;
        user.location = location || user.location;
        user.age = age || user.age;

        if (req.file) {
            user.profilePicture = `uploads/${req.file.filename}`;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                bio: user.bio,
                interests: user.interests,
                location: user.location,
                age: user.age,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            message: 'Error updating profile',
            error: error.message 
        });
    }
};

// Add a get profile endpoint
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            message: 'Error fetching profile',
            error: error.message 
        });
    }
};
