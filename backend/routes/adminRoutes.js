const express = require('express');
const { getDashboardStats, getAllRoomsAdmin, getAllBookings, updateBookingStatus, getOccupancyReport, getRevenueReport, getNotifications, markNotificationRead } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/rooms', getAllRoomsAdmin);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/reports/occupancy', getOccupancyReport);
router.get('/reports/revenue', getRevenueReport);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
