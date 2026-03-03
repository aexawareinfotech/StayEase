const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

exports.createBooking = async (data) => {
    const { user, room, checkIn, checkOut, guests } = data;

    const roomDetails = await Room.findById(room);
    if (!roomDetails) {
        throw new ErrorResponse('Room not found', 404);
    }

    if (roomDetails.status !== 'available') {
        throw new ErrorResponse('Room is currently under maintenance', 400);
    }

    if (guests > roomDetails.capacity) {
        throw new ErrorResponse(`Room capacity is ${roomDetails.capacity}, cannot accommodate ${guests} guests`, 400);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        throw new ErrorResponse('Check-out date must be after check-in date', 400);
    }

    // Double availability check
    const conflictingBookings = await Booking.find({
        room,
        status: { $in: ['confirmed', 'checked-in'] },
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
    });

    if (conflictingBookings.length > 0) {
        throw new ErrorResponse('Room is already booked for these dates', 400);
    }

    // Calculate total price
    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
    const totalPrice = days * roomDetails.price;

    const booking = await Booking.create({
        user,
        room,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice
    });

    await Notification.create({
        message: `New booking created for room ${roomDetails.roomNumber}`,
        type: 'booking'
    });

    return booking;
};

exports.getUserBookings = async (userId) => {
    return await Booking.find({ user: userId }).populate('room', 'roomNumber type price');
};

exports.cancelBooking = async (bookingId, userId) => {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
        throw new ErrorResponse('Booking not found or not authorized', 404);
    }

    if (booking.status === 'cancelled') {
        throw new ErrorResponse('Booking is already cancelled', 400);
    }

    if (booking.status !== 'confirmed') {
        throw new ErrorResponse(`Cannot cancel booking with status ${booking.status}`, 400);
    }

    booking.status = 'cancelled';
    await booking.save();

    await Notification.create({
        message: `Booking ${booking._id} has been cancelled`,
        type: 'cancellation'
    });

    return booking;
};

exports.modifyBooking = async (bookingId, userId, updateData) => {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
        throw new ErrorResponse('Booking not found or not authorized', 404);
    }

    if (booking.status !== 'confirmed') {
        throw new ErrorResponse(`Cannot modify booking with status ${booking.status}`, 400);
    }

    const roomDetails = await Room.findById(booking.room);

    let { checkIn, checkOut, guests } = updateData;
    checkIn = checkIn ? new Date(checkIn) : booking.checkIn;
    checkOut = checkOut ? new Date(checkOut) : booking.checkOut;
    guests = guests || booking.guests;

    if (guests > roomDetails.capacity) {
        throw new ErrorResponse(`Room capacity is ${roomDetails.capacity}, cannot accommodate ${guests} guests`, 400);
    }

    if (checkIn >= checkOut) {
        throw new ErrorResponse('Check-out date must be after check-in date', 400);
    }

    // Availability check for new dates (excluding current booking)
    const conflictingBookings = await Booking.find({
        _id: { $ne: bookingId },
        room: booking.room,
        status: { $in: ['confirmed', 'checked-in'] },
        $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
        ]
    });

    if (conflictingBookings.length > 0) {
        throw new ErrorResponse('Room is already booked for requested modified dates', 400);
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.round(Math.abs((checkOut - checkIn) / oneDay));
    const totalPrice = days * roomDetails.price;

    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    booking.guests = guests;
    booking.totalPrice = totalPrice;

    await booking.save();
    return booking;
};

exports.payBooking = async (bookingId, userId, paymentMethod) => {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
        throw new ErrorResponse('Booking not found or not authorized', 404);
    }

    if (booking.paymentStatus === 'PAID') {
        throw new ErrorResponse('Booking is already paid', 400);
    }

    const transactionId = 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000);

    booking.paymentStatus = 'PAID';
    booking.paymentMethod = paymentMethod;
    booking.transactionId = transactionId;

    await booking.save();
    return booking;
};
