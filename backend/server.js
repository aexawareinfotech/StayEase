const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/error');

// Route files
const auth = require('./routes/authRoutes');
const rooms = require('./routes/roomRoutes');
const bookings = require('./routes/bookingRoutes');
const admin = require('./routes/adminRoutes');
const emails = require('./routes/emailRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/rooms', rooms);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/admin', admin);
app.use('/api/v1/emails', emails);
app.use('/api/v1/contact', contactRoutes);

app.get("/", (req, res) => {
    res.send("StayEase API Running....");
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stayease')
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));