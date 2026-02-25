const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stayease');

const users = [
    {
        name: "Admin User",
        email: "admin@stayease.com",
        password: "Admin@123", // Hashes on save
        phone: "1234567890",
        role: "admin"
    },
    {
        name: "Regular User",
        email: "user@stayease.com",
        password: "Password@123", // Hashes on save
        phone: "0987654321",
        role: "guest"
    }
];

const rooms = [
    {
        roomNumber: "101",
        type: "Single",
        description: "Cozy single room located in Connaught Place, New Delhi – 110001.",
        price: 2999,
        capacity: 1,
        amenities: ["WiFi", "TV"],
        status: "available"
    },
    {
        roomNumber: "102",
        type: "Double",
        description: "Spacious double room located in Banjara Hills, Hyderabad – 500034.",
        price: 4999,
        capacity: 2,
        amenities: ["WiFi", "TV", "Minibar"],
        status: "available"
    },
    {
        roomNumber: "103",
        type: "Deluxe",
        description: "Premium deluxe experience located at MG Road, Bengaluru – 560001.",
        price: 7499,
        capacity: 3,
        amenities: ["WiFi", "TV", "Minibar", "Bathtub"],
        status: "available"
    },
    {
        roomNumber: "201",
        type: "Suite",
        description: "Luxury suite with beautiful views located at SG Highway, Ahmedabad – 380015.",
        price: 12999,
        capacity: 4,
        amenities: ["WiFi", "TV", "Minibar", "Jacuzzi", "Ocean View"],
        status: "available"
    }
];

// Import into DB
const importData = async () => {
    try {
        await User.deleteMany();
        await Room.deleteMany();
        await Booking.deleteMany();

        // Hash passwords for seed users (mongoose middleware is bypassed by insertMany in some cases, so let's hash manually or create them one by one)
        for (const u of users) {
            const salt = await bcrypt.genSalt(10);
            u.password = await bcrypt.hash(u.password, salt);
        }
        await User.insertMany(users);
        await Room.insertMany(rooms);

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Destroy data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Room.deleteMany();
        await Booking.deleteMany();

        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please provide a valid flag: -i to import, -d to delete');
    process.exit(1);
}
