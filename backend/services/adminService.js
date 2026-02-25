const Booking = require('../models/Booking');
const Room = require('../models/Room');
const ErrorResponse = require('../utils/errorResponse');

exports.getDashboardStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const revenueObj = await Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueObj.length > 0 ? revenueObj[0].totalRevenue : 0;

    const activeBookings = await Booking.countDocuments({ status: { $in: ['confirmed', 'checked-in'] } });

    const todaysCheckIns = await Booking.countDocuments({
        checkIn: { $gte: today, $lt: tomorrow },
        status: { $in: ['confirmed'] }
    });

    const todaysCheckOuts = await Booking.countDocuments({
        checkOut: { $gte: today, $lt: tomorrow },
        status: { $in: ['checked-in'] }
    });

    return {
        totalRevenue,
        activeBookings,
        todaysCheckIns,
        todaysCheckOuts
    };
};

exports.getAllBookings = async (query) => {
    return await Booking.find(query).populate('user', 'name email').populate('room', 'roomNumber type');
};

exports.updateBookingStatus = async (id, status) => {
    if (!['confirmed', 'cancelled', 'checked-in', 'checked-out'].includes(status)) {
        throw new ErrorResponse('Invalid status', 400);
    }
    return await Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

exports.getOccupancyReport = async (query) => {
    const { startDate, endDate } = query;
    if (!startDate || !endDate) {
        throw new ErrorResponse('Please provide startDate and endDate', 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const totalRooms = await Room.countDocuments({ status: 'available' });

    const bookingsInPeriod = await Booking.find({
        status: { $ne: 'cancelled' },
        $or: [
            { checkIn: { $lte: end }, checkOut: { $gte: start } }
        ]
    });

    const oneDay = 24 * 60 * 60 * 1000;
    const periodDays = Math.round(Math.abs((end - start) / oneDay)) + 1;

    let totalOccupiedRoomNights = 0;

    bookingsInPeriod.forEach(booking => {
        let bookingStart = booking.checkIn > start ? booking.checkIn : start;
        let bookingEnd = booking.checkOut < end ? booking.checkOut : end;
        let nights = Math.round(Math.abs((bookingEnd - bookingStart) / oneDay));
        totalOccupiedRoomNights += nights;
    });

    const totalPossibleRoomNights = totalRooms * periodDays;
    const occupancyRate = totalPossibleRoomNights === 0 ? 0 : (totalOccupiedRoomNights / totalPossibleRoomNights) * 100;

    return {
        periodStart: start,
        periodEnd: end,
        totalRooms,
        occupiedRoomNights: totalOccupiedRoomNights,
        possibleRoomNights: totalPossibleRoomNights,
        occupancyRate: Math.round(occupancyRate * 100) / 100 + '%'
    };
};

exports.getRevenueReport = async (query) => {
    const { startDate, endDate } = query;
    if (!startDate || !endDate) {
        throw new ErrorResponse('Please provide startDate and endDate', 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set end date boundary
    end.setHours(23, 59, 59, 999);

    const revenueObj = await Booking.aggregate([
        {
            $match: {
                status: { $ne: 'cancelled' },
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                dailyRevenue: { $sum: '$totalPrice' },
                bookingsCount: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const totalRevenue = revenueObj.reduce((acc, curr) => acc + curr.dailyRevenue, 0);
    const totalBookings = revenueObj.reduce((acc, curr) => acc + curr.bookingsCount, 0);

    return {
        periodStart: start,
        periodEnd: end,
        totalRevenue,
        totalBookings,
        dailyBreakdown: revenueObj
    };
};
