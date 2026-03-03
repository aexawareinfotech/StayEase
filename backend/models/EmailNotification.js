const mongoose = require('mongoose');

const emailNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['WELCOME', 'BOOKING_CONFIRMATION'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('EmailNotification', emailNotificationSchema);
