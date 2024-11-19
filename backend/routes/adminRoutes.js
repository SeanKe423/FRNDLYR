const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all reports
router.get('/reports', auth, admin, async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'username email')
            .populate('reportedUser', 'username email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

// Update report status
router.put('/reports/:reportId', auth, admin, async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.reportId,
            { status: req.body.status },
            { new: true }
        );
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error updating report' });
    }
});

// Ban user
router.post('/ban-user/:userId', auth, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { 
                isBanned: true,
                banReason: req.body.reason
            },
            { new: true }
        );
        res.json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error banning user' });
    }
});

// Unban user
router.post('/unban-user/:userId', auth, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { 
                isBanned: false,
                banReason: null
            },
            { new: true }
        );
        res.json({ message: 'User unbanned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unbanning user' });
    }
});

module.exports = router; 