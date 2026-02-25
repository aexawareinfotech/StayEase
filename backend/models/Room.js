const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Single', 'Double', 'Suite', 'Deluxe'], required: true },
    description: { type: String },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    status: { type: String, enum: ['available', 'maintenance'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
