const adminService = require('../services/adminService');
const ErrorResponse = require('../utils/errorResponse');

const Booking = require('../models/Booking');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkIns = await Booking.countDocuments({
            checkIn: { $gte: today },
            status: "confirmed"
        });

        const checkOuts = await Booking.countDocuments({
            checkOut: { $gte: today },
            status: "confirmed"
        });

        const Room = require('../models/Room');
        const totalRooms = await Room.countDocuments();

        const bookedRooms = await Booking.countDocuments({
            status: { $in: ["confirmed", "checked-in"] }
        });

        const occupancyRate =
            totalRooms === 0
                ? 0
                : ((bookedRooms / totalRooms) * 100).toFixed(2);

        res.status(200).json({
            success: true,
            data: {
                checkIns,
                checkOuts,
                occupancyRate,
                // Fallbacks so the rest of the existing dashboard cards don't break
                activeBookings: bookedRooms,
                availableRooms: totalRooms - bookedRooms,
                weeklyRevenue: 0,
                monthlyRevenue: 0
            }
        });
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
        const { status, search } = req.query;
        let filter = {};
        if (status) filter.status = status;

        let bookings = await Booking.find(filter).populate('user').populate('room').sort({ createdAt: -1 });

        if (search) {
            const s = search.toLowerCase();
            bookings = bookings.filter(b => 
                (b.user && b.user.name && b.user.name.toLowerCase().includes(s)) ||
                (b.bookingId && b.bookingId.toLowerCase().includes(s)) ||
                (b._id.toString().includes(s))
            );
        }

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const users = await User.find();
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

exports.getLogs = async (req, res, next) => {
    try {
        const Log = require('../models/Log');
        const logs = await Log.find().sort({ date: -1 });
        res.json({ success: true, count: logs.length, data: logs });
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
const Room = require('../models/Room');

exports.createRoom = async (req, res, next) => {
    try {

        const room = await Room.create(req.body);

        res.status(201).json({
            success: true,
            data: room
        });

    } catch (error) {
        next(error);
    }
};
exports.updateRoom = async (req, res) => {
    const room = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({
        success: true,
        data: room
    });
};

exports.deleteRoom = async (req, res) => {
    try {

        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.json({
            success: true,
            message: "Room deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
};

exports.getReports = async (req, res, next) => {
    try {
        const start = new Date(req.query.startDate);
        const end = new Date(req.query.endDate);
        
        // include full end day
        end.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: { $in: ["confirmed", "checked-in"] }
        });

        // total bookings
        const totalBookings = bookings.length;

        // total revenue (Supporting totalPrice from the model)
        const totalRevenue = bookings.reduce(
            (sum, b) => sum + (b.totalPrice || b.totalAmount || 0),
            0
        );

        // occupancy
        const totalRooms = await Room.countDocuments();

        const occupancyRate =
            totalRooms === 0
                ? 0
                : ((totalBookings / totalRooms) * 100).toFixed(2);

        res.json({
            success: true,
            data: {
                totalBookings,
                totalRevenue,
                occupancyRate,
                bookings
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Report generation failed" });
    }
};