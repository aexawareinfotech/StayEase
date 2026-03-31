const express = require('express');
const { updateRoom, deleteRoom } = require('../controllers/adminController');
const {
    getDashboardStats,
    getAllRoomsAdmin,
    getAllBookings,
    getAllUsers,
    getLogs,
    updateBookingStatus,
    getOccupancyReport,
    getRevenueReport,
    getNotifications,
    markNotificationRead,
    createRoom,
    getReports
} = require('../controllers/adminController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);

router.get('/rooms', getAllRoomsAdmin);

// ADD THIS ROUTE
router.post('/rooms', createRoom);

router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/users', getAllUsers);
router.get('/logs', getLogs);

router.get('/reports/occupancy', getOccupancyReport);
router.get('/reports/revenue', getRevenueReport);
router.get('/reports', getReports);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

module.exports = router;