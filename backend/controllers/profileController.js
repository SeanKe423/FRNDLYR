// backend/controllers/profileController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.updateProfile = async (req, res) => {
    const { bio, interests, location } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Assumes Bearer token format
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.bio = bio || user.bio;
        user.interests = interests || user.interests;
        user.location = location || user.location;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
