const roomService = require('../services/roomService');
const ErrorResponse = require('../utils/errorResponse');

exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await roomService.getRooms(req.query);
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        next(error);
    }
};

exports.getRoom = async (req, res, next) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        if (!room) {
            return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

exports.createRoom = async (req, res, next) => {
    try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

exports.updateRoom = async (req, res, next) => {
    try {
        const room = await roomService.updateRoom(req.params.id, req.body);
        if (!room) {
            return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

exports.deleteRoom = async (req, res, next) => {
    try {
        const room = await roomService.deleteRoom(req.params.id);
        if (!room) {
            return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

exports.searchRooms = async (req, res, next) => {
    try {
        const rooms = await roomService.searchRooms(req.query);
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        next(error);
    }
};
