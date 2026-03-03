const express = require('express');
const { protect } = require('../middlewares/auth');
const EmailNotification = require('../models/EmailNotification');
const router = express.Router();

router.get('/my', protect, async (req, res, next) => {
    try {
        const emails = await EmailNotification.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: emails });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
