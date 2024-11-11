// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserProfile = require('../models/UserProfile');

router.get('/profile', auth, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user.id });
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ msg: "Profile not found" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
