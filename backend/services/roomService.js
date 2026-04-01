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

const ObjectRoomImages = {
    Single: [
        "https://images.unsplash.com/photo-1505693314120-0d443867891c",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
    ],
    Double: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
    ],
    Deluxe: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
    ],
    Suite: [
        "https://images.unsplash.com/photo-1578898886225-c7c8940473f0",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ]
};

exports.createRoom = async (data) => {
    const images = ObjectRoomImages[data.type] || [];
    if (!data.images || data.images.length === 0) {
        data.images = images;
    }
    return await Room.create(data);
};

exports.updateRoom = async (id, data) => {
    const images = ObjectRoomImages[data.type] || [];
    if (!data.images || data.images.length === 0) {
        data.images = images;
    }
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

exports.getAvailableRooms = async (query) => {
    // Reuse the same logic as searchRooms for date and filter based availability
    return await exports.searchRooms(query);
};
