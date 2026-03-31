const Booking = require('../models/Booking');
const EmailNotification = require('../models/EmailNotification');
const bookingService = require('../services/bookingService');
const ErrorResponse = require('../utils/errorResponse');

exports.createBooking = async (req, res, next) => {
    try {
        const data = { ...req.body, user: req.user._id };
        const booking = await bookingService.createBooking(data);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

exports.payBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.paymentStatus = "PAID";
        booking.paymentMethod = req.body.paymentMethod;
        booking.transactionId = req.body.transactionId;

        await booking.save();

        // Simulated Booking Email
        await EmailNotification.create({
            userId: req.user._id,
            email: req.user.email,
            subject: "Booking Confirmation – StayEase",
            message: `Booking ID: ${booking._id}\nCheck-in: ${new Date(booking.checkIn).toLocaleDateString()}\nCheck-out: ${new Date(booking.checkOut).toLocaleDateString()}\nTotal: ₹ ${booking.totalPrice.toLocaleString('en-IN')}`,
            type: "BOOKING_CONFIRMATION"
        });

        res.status(200).json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getUserBookings(req.user._id);
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Not found" });

        const calculateRefund = (b) => {
            const now = new Date();
            const checkIn = new Date(b.checkIn);
            const diffHours = (checkIn - now) / (1000 * 60 * 60);

            if (diffHours > 24) return b.totalPrice;
            return b.totalPrice * 0.5;
        };

        const refund = calculateRefund(booking);
        booking.refundAmount = refund;
        booking.status = "cancelled";
        await booking.save();

        const Log = require('../models/Log');
        await Log.create({
            action: "Booking Cancelled",
            user: booking.user || req.user._id
        });

        res.json({ message: "Booking cancelled", booking });
    } catch (error) {
        next(error);
    }
};

exports.modifyBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.modifyBooking(req.params.id, req.user._id, req.body);
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};
