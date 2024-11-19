const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// Submit report
router.post('/submit', auth, async (req, res) => {
    try {
        console.log('Received report:', req.body); // Debug log

        const { reportedUserId, reason, description } = req.body;

        if (!reportedUserId || !reason || !description) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
        }

        const report = new Report({
            reporter: req.user.id,
            reportedUser: reportedUserId,
            reason,
            description
        });

        await report.save();
        console.log('Report saved:', report); // Debug log

        res.status(201).json({ 
            message: 'Report submitted successfully',
            report 
        });
    } catch (error) {
        console.error('Report submission error:', error);
        res.status(500).json({ 
            message: 'Error submitting report',
            error: error.message 
        });
    }
});

module.exports = router; 