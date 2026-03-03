const adminService = require('../services/adminService');
const ErrorResponse = require('../utils/errorResponse');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

exports.getAllRoomsAdmin = async (req, res, next) => {
    try {
        const rooms = await adminService.getAllRooms();
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        next(error);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await adminService.getAllBookings(req.query);
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

exports.updateBookingStatus = async (req, res, next) => {
    try {
        const booking = await adminService.updateBookingStatus(req.params.id, req.body.status);
        if (!booking) {
            return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

exports.getOccupancyReport = async (req, res, next) => {
    try {
        const report = await adminService.getOccupancyReport(req.query);
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
};

exports.getRevenueReport = async (req, res, next) => {
    try {
        const report = await adminService.getRevenueReport(req.query);
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
};

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await adminService.getNotifications();
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.markNotificationRead = async (req, res, next) => {
    try {
        const notification = await adminService.markNotificationRead(req.params.id);
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};
