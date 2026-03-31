const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    refundAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['confirmed', 'cancelled', 'checked-in', 'checked-out'], default: 'confirmed' },
    bookingId: { type: String, unique: true },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING"
    },
    paymentMethod: { type: String },
    transactionId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
