const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// Submit a report
router.post('/submit', auth, async (req, res) => {
    try {
        const { reportedUserId, reason, description } = req.body;

        const report = new Report({
            reporter: req.user.id,
            reportedUser: reportedUserId,
            reason,
            description
        });

        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Report submission error:', error);
        res.status(500).json({ message: 'Error submitting report' });
    }
});

// Get user's submitted reports
router.get('/my-reports', auth, async (req, res) => {
    try {
        const reports = await Report.find({ reporter: req.user.id })
            .populate('reportedUser', 'username')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

module.exports = router; 