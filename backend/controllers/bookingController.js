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
        const { paymentMethod } = req.body;
        const booking = await bookingService.payBooking(req.params.id, req.user._id, paymentMethod);
        res.status(200).json({ success: true, data: booking });
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
        const booking = await bookingService.cancelBooking(req.params.id, req.user._id);
        res.status(200).json({ success: true, data: booking });
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
