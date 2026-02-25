const Room = require('../models/Room');
const Booking = require('../models/Booking');

exports.getRooms = async (query) => {
    const reqQuery = { ...query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    const rooms = await Room.find(JSON.parse(queryStr));
    return rooms;
};

exports.getRoomById = async (id) => {
    return await Room.findById(id);
};

exports.createRoom = async (data) => {
    return await Room.create(data);
};

exports.updateRoom = async (id, data) => {
    return await Room.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

exports.deleteRoom = async (id) => {
    return await Room.findByIdAndUpdate(id, { status: 'maintenance' }, { new: true });
};

exports.searchRooms = async (query) => {
    const { checkin, checkout, guests, type, minPrice, maxPrice, amenities } = query;

    let roomFilter = { status: 'available' };

    if (guests) roomFilter.capacity = { $gte: Number(guests) };
    if (type) roomFilter.type = type;

    if (minPrice || maxPrice) {
        roomFilter.price = {};
        if (minPrice) roomFilter.price.$gte = Number(minPrice);
        if (maxPrice) roomFilter.price.$lte = Number(maxPrice);
    }

    if (amenities) {
        const amenitiesArr = amenities.split(',');
        roomFilter.amenities = { $all: amenitiesArr };
    }

    let rooms = await Room.find(roomFilter);

    if (checkin && checkout) {
        const checkInDate = new Date(checkin);
        const checkOutDate = new Date(checkout);

        const conflictingBookings = await Booking.find({
            status: { $in: ['confirmed', 'checked-in'] },
            $or: [
                { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
            ]
        });

        const bookedRoomIds = conflictingBookings.map(b => b.room.toString());
        rooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
    }

    return rooms;
};
