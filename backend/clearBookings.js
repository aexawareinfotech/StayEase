const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

const connectStr = process.env.MONGO_URI || 'mongodb://localhost:27017/stayease';

mongoose.connect(connectStr)
    .then(async () => {
        console.log("MongoDB Connected. Deleting all old bookings...");
        const result = await Booking.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} bookings.`);
        process.exit(0);
    })
    .catch(err => {
        console.error("Error connecting or deleting:");
        console.error(err);
        process.exit(1);
    });
